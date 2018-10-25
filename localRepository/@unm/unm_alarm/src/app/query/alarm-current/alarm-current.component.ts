import { Component, ViewChild, ElementRef } from '@angular/core';
import { constant } from '../../unm-alarm.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import * as  addDays from 'date-fns/add_days';
import * as  subMinutes from 'date-fns/sub_minutes';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNode } from 'ng-zorro-antd';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { process, State } from '@progress/kendo-data-query';
import { UnmAlarmHttpService } from '../../service/unm-alarm-http.service';
import { Router, NavigationStart } from '@angular/router';

import { GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { UnmAlarmModel, UnmAlarmConditionModel, AlmSourceModel, AlarmTemplateType } from '../../model/unm-alarm.model';
import { PushService } from "@waf_service/push";

/**
 * alarm-current
 * @export
 * @class AlarmCurrentComponent
 */
@Component({
    templateUrl: './alarm-current.component.html',
    styleUrls: ['./alarm-current.component.scss']
})
export class AlarmCurrentComponent {
    @ViewChild('nzTree2loginZone') tree2logicZone: NzTreeComponent;
    @ViewChild('nzTree2position') tree2position: NzTreeComponent;
    @ViewChild('mytable') mytable: any;

    conditionArray = [];//当前已选告警查询条件

    userList = [];//用于保存所有用户信息
    //告警条件回显
    conditionChange(item) {

        switch (item) {
            case "紧急": this.alarmLevelSelectChange(false, '1'); this.alarm_level_1_checked = false; break;
            case "主要": this.alarmLevelSelectChange(false, '2'); this.alarm_level_2_checked = false; break;
            case "次要": this.alarmLevelSelectChange(false, '3'); this.alarm_level_3_checked = false; break;
            case "提示": this.alarmLevelSelectChange(false, '4'); this.alarm_level_4_checked = false; break;
            case "未确认未清除": this.alarmStatusSelectChange(false, '1'); this.alarm_status_1_checked = false; break;
            case "已确认未清除": this.alarmStatusSelectChange(false, '2'); this.alarm_status_2_checked = false; break;
            case "未确认已清除": this.alarmStatusSelectChange(false, '3'); this.alarm_status_3_checked = false; break;
            case "已确认已清除": this.alarmStatusSelectChange(false, '4'); this.alarm_status_4_checked = false; break;
            case "最近1小时": this.alarmOccurTimeSelectChange(false, '1'); this.alarm_occur_time_1_checked = false; break;
            case "最近24小时": this.alarmOccurTimeSelectChange(false, '2'); this.alarm_occur_time_2_checked = false; break;
            case "最近3天": this.alarmOccurTimeSelectChange(false, '3'); this.alarm_occur_time_3_checked = false; break;
            case "最近7天": this.alarmOccurTimeSelectChange(false, '4'); this.alarm_occur_time_4_checked = false; break;
            case "自定义": this.alarmOccurTimeSelectChange(false, '5'); this.alarm_occur_time_5_checked = false; break;
            case this.convertAlarmCodeValue2String(this.alarmCodeValue):
                this.deleteArrayElement(this.conditionArray, item);
                this.alarmCodeValue.forEach(element => {
                    element.selected = false;
                });
                this.alarmCodeValue = []; break;
        }
    }
    /**
     * 构造函数
     * @param {LoggerService} logger
     * @param {ContextService} context
     * @memberof UnmAlarmModule
     */
    constructor(private wsService: PushService, private router: Router, private alarmHttpService: UnmAlarmHttpService, private logger: LoggerService, private context: ContextService) {

    }
    allAlarmTypeList = [];//用来全局缓存所有告警类型模型
    /*alarmTypeModel
      {"operType":"READ", 
      "oid":null, 
      "operationId":0,
       "alarmTypeId":1, 
       "alarmTypeCode":1,
        "alarmKindId":2, 
        "name":"SDH物理接口信号丢失",
         "shortName":"SPI_LOS",
          "level":3, 
          "objType":3, 
          "specialType":6, 
          "alarmClass":0, 
          "alarmCodeClass":"otnm" }
          */

    getAlarmByAlarmId(alarmTypeId) {
        let alarmName = "";
        for (let i = 0; i < this.allAlarmTypeList.length; i++) {
            let element = this.allAlarmTypeList[i];
            if (element.alarmTypeId == alarmTypeId) {
                alarmName = element.name;
                break;
            }
        }
        return alarmName;
    }


    ngOnInit(): void {
        let me = this;
        //初始化告警条件--告警模板信息
        this.alarmCurrentTemplates.push({ "templateName": "不使用" });
        this.alarmHttpService.getAlarmTemplates().then(
            (value: any) => {
                value.forEach(element => {
                    if (element.templateTypeId == AlarmTemplateType.CurrentAlarm) {
                        this.alarmCurrentTemplates.push(element);
                    }
                })
            },
            (desc: string) => { console.log(desc) }
        );
        //初始化查询所有告警代码信息
        this.alarmHttpService.getAlmTypes().then(
            (value: any) => {
                this.allAlarmTypeList = value;
                this.alarmCodeOptions = [];
                value.forEach(element => {
                    element.label = element.alarmTypeCode + " " + element.name;
                    this.alarmCodeOptions.push(element);
                })
            },
            (desc: string) => { console.log(desc) }
        );
        //初始化查询所有网元信息
        this.alarmHttpService.getNEList().then(
            (value: any) => {
                this.alarmSource_single_suggestions = value;
            },
            (desc: string) => { console.log(desc) }
        );

        //初始化查询用户列表信息
        this.alarmHttpService.getUserList().then(
            (value: any) => {
                this.userList = value;
                me.resetUserOptions();
            },
            (desc: string) => { console.log(desc) }
        );

        this.initColDataArray2modify();

    }

    resetUserOptions() {
        this.confirmuser_dropdownOptions = [];
        this.select_confirm_user_options = [];
        this.clearuser_dropdownOptions = [];
        this.select_clear_user_options = [];
        this.userList.forEach(element => {

            this.confirmuser_dropdownOptions.push({ "label": element.name, "value": element, "selected": true });
            this.select_confirm_user_options.push({ "label": element.name, "value": element, "selected": true });

            this.clearuser_dropdownOptions.push({ "label": element.name, "value": element, "selected": true });
            this.select_clear_user_options.push({ "label": element.name, "value": element, "selected": true });

        });
    }
    //告警条件---模板信息
    alarmCurrentTemplates = [];
    selectedTemplate;
    // = { "templateName": "不使用" };
    selectedTemplate_condition;
    selectTemplate() {
        //根据切换模板信息反射所有条件选中情况
        console.log(this.selectedTemplate);
        if (this.selectedTemplate.templateName == "不使用") {
            this.resetCondition();
            return;
        }
        let me = this;
        this.alarmHttpService.getAlarmTemplateDetail(this.selectedTemplate).then(
            (value: any) => {
                me.selectedTemplate_condition = value.almQueryCondition;
                me.reflectTemplateCondition2eachCondition(me.selectedTemplate_condition);
            },
            (desc: string) => { console.log(desc) }
        );

    }

    reflectTemplateCondition2eachCondition(condition) {
        //1、切换模板前首先清除所有条件
        this.resetCondition();
        if (condition == null) {
            return;
        }
        //2、根据模板告警条件反射至当前条件列表中展示。
        //告警级别、告警状态、发生时间、告警源、告警代码需要回显
        //若告警级别不为空
        if (condition.strLevels) {
            let strLevels = condition.strLevels.split(",");
            strLevels.forEach(item => {
                if (item == "0") {
                    this.alarm_level_1_checked = true;
                    this.alarmLevelSelectChange(true, '1');
                } else if (item == "1") {
                    this.alarm_level_2_checked = true;
                    this.alarmLevelSelectChange(true, '2');
                } else if (item == "2") {
                    this.alarm_level_3_checked = true;
                    this.alarmLevelSelectChange(true, '3');
                } else if (item == "3") {
                    this.alarm_level_4_checked = true;
                    this.alarmLevelSelectChange(true, '4');
                }
            })
        }
        //若告警状态不为空
        if (condition.strStatues) {
            let strStatues = condition.strStatues.split(',');
            strStatues.forEach(item => {
                if (item == "0") {
                    this.alarmStatusSelectChange(true, '1');
                    this.alarm_status_1_checked = true;
                } else if (item == "1") {
                    this.alarmStatusSelectChange(true, '2');
                    this.alarm_status_2_checked = true;
                } else if (item == "2") {
                    this.alarmStatusSelectChange(true, '3');
                    this.alarm_status_3_checked = true;
                } else if (item == "3") {
                    this.alarmStatusSelectChange(true, '4');
                    this.alarm_status_4_checked = true;
                }
            })
        }

        //告警发生时间
        let createTimeTemp = condition.createTimeFromNowInMinutes;
        let createTimeRangeTemp = condition.createTimeRange;
        //如果告警发生时间范围不为空，则设置至自定义中
        if (createTimeRangeTemp.startDate && createTimeRangeTemp.endDate) {
            this.alarmOccurTimeSelectChange(true, "5");
            this.current_select_alarm_occur_time = '5';
            this.alarm_occur_time_5_checked = true;
            let create_startDate = new Date(createTimeRangeTemp.startDate);
            let create_endDate = new Date(createTimeRangeTemp.endDate);
            this.createTimeRange = [create_startDate, create_endDate];//自定义时间范围

        } else {
            if (createTimeTemp == 0) {
                //若为0(单位：分钟)则选择全部
                this.alarmOccurTimeSelectChange(true, "0");
                this.current_select_alarm_occur_time = '0';
                this.alarm_occur_time_0_checked = true;
            } else if (createTimeTemp == 1 * 60) {
                //若为60(单位：分钟)则选择最近一小时
                this.alarmOccurTimeSelectChange(true, "1");
                this.current_select_alarm_occur_time = '1';
                this.alarm_occur_time_1_checked = true;
            } else if (createTimeTemp == 24 * 60) {
                //若为24*60(单位：分钟)则选择最近24小时
                this.alarmOccurTimeSelectChange(true, "2");
                this.current_select_alarm_occur_time = '2';
                this.alarm_occur_time_2_checked = true;
            }
            else if (createTimeTemp == 3 * 24 * 60) {
                //若为3*24*60(单位：分钟)则选择最近3天
                this.alarmOccurTimeSelectChange(true, "3")
                this.current_select_alarm_occur_time = '3';
                this.alarm_occur_time_3_checked = true;
            }
            else if (createTimeTemp == 7 * 24 * 60) {
                //若为7*24*60(单位：分钟)则选择最近7天
                this.alarmOccurTimeSelectChange(true, "4");
                this.current_select_alarm_occur_time = '4';
                this.alarm_occur_time_4_checked = true;
            } else {
                //其他选择自定义
                this.alarmOccurTimeSelectChange(true, "5");
                this.current_select_alarm_occur_time = '5';
                this.alarm_occur_time_5_checked = true;
                this.createTimeRange = [subMinutes(new Date(), createTimeTemp), new Date()];//自定义时间范围
            }
        }

        //告警源
        console.log("@@@@@@@@@");
        let almSourceBean = condition.almSourceBean;
        if (!almSourceBean) {
            //若不存在almSourceBean属性，则告警源属性全部重置
            this.alarmSourceValue_single = null;
            //todo 多选
        }
        if (almSourceBean.allSelect) {
            //若为全部选中
            this.alarmSourceValue_single = null;
            //todo 多选
        } else {
            let objBeans = almSourceBean.objBeans;
            if (objBeans.length == 1) {
                //若为单选
                let neInfo = objBeans[0];
                let neId = neInfo.objId.neId;
                for (let i = 0; i < this.alarmSource_single_suggestions.length; i++) {
                    let ele = this.alarmSource_single_suggestions[i];
                    if (ele.objId == neId) {
                        this.alarmSourceValue_single = ele;
                        break;
                    }
                }

            } else {
                //若为多选
                this.alarmSourceValue_single = null;
                //todo 多选
            }
        }

        //告警代码
        if (condition.strAlmTypes) {
            let array = [];
            let selectedTypes = condition.strAlmTypes.split(',');
            for (let i = 0; i < selectedTypes.length; i++) {
                let type = selectedTypes[i];
                for (let j = 0; j < this.alarmCodeOptions.length; j++) {
                    let comparedType = this.alarmCodeOptions[j];
                    if (type == String(comparedType.alarmTypeCode)) {
                        comparedType.selected = true;
                        array.push(comparedType);
                        break;
                    }
                }
            }
            this.alarmCodeValue = array;
            //将最新模板的告警代码信息回显
            let huixianAlmCodeString = this.convertAlarmCodeValue2String(this.alarmCodeValue);
            if (huixianAlmCodeString) {
                this.conditionArray.push(huixianAlmCodeString);
            }

        }

        //告警类型
        if (condition.strKinds) {
            let strKinds = condition.strKinds.split(',');
            this.select_alarm_type_options = [];
            strKinds.forEach(item => {
                if (item == '0') {
                    this.select_alarm_type_options.push({ "label": "通信质量", "value": "0", "selected": true });
                } else if (item == '1') {
                    this.select_alarm_type_options.push({ "label": "环境告警", "value": "1", "selected": true });
                } else if (item == '2') {
                    this.select_alarm_type_options.push({ "label": "设备故障", "value": "2", "selected": true });
                } else if (item == '3') {
                    this.select_alarm_type_options.push({ "label": "服务质量", "value": "3", "selected": true });
                } else if (item == '4') {
                    this.select_alarm_type_options.push({ "label": "处理错误告警", "value": "4", "selected": true });
                } else if (item == '5') {
                    this.select_alarm_type_options.push({ "label": "安全告警", "value": "5", "selected": true });
                }
            })
        }
        //确认用户
        if (condition.strConfirmUsers) {
            let strConfirmUsers = condition.strConfirmUsers.split(',');
            //首先将所有用户选中状态改为false,再将当前确认用户列表中用户选中状态修改为true，
            //由于数组的双向数据绑定需要重新创建对象，因此重新创建数组。
            let new_select_confirm_user_options = [];
            for (let i = 0; i < this.select_confirm_user_options.length; i++) {
                let eachElement = this.select_confirm_user_options[i];
                eachElement.selected = false;
                for (let j = 0; j < strConfirmUsers.length; j++) {
                    let user = strConfirmUsers[j];
                    if (eachElement.id == user.id) {
                        eachElement.selected = true;
                        new_select_confirm_user_options.push(eachElement);
                        break;
                    }
                }
            }
            this.select_confirm_user_options = new_select_confirm_user_options;
        }
        //清除用户
        if (condition.strClearUsers) {
            let strClearUsers = condition.strClearUsers.split(',');
            //首先将所有用户选中状态改为false,再将当前确认用户列表中用户选中状态修改为true，
            //由于数组的双向数据绑定需要重新创建对象，因此重新创建数组。
            let new_select_clear_user_options = [];
            for (let i = 0; i < this.select_clear_user_options.length; i++) {
                let eachElement = this.select_clear_user_options[i];
                eachElement.selected = false;
                for (let j = 0; j < strClearUsers.length; j++) {
                    let user = strClearUsers[j];
                    if (eachElement.id == user.id) {
                        eachElement.selected = true;
                        new_select_clear_user_options.push(eachElement);
                        break;
                    }
                }
            }
            this.select_clear_user_options = new_select_clear_user_options;
        }

        //确认时间
        let confirm_startDate = null;
        let confirm_endDate = null;
        let tempConfirmTimeRange = [];
        if (condition.confirmTimeRange.startDate) {
            confirm_startDate = new Date(condition.confirmTimeRange.startDate);
            tempConfirmTimeRange.push(confirm_startDate);
        }
        if (condition.confirmTimeRange.endDate) {
            confirm_endDate = new Date(condition.confirmTimeRange.endDate);
            tempConfirmTimeRange.push(confirm_endDate);
        }
        this.confirmTimeRange = tempConfirmTimeRange;

        //清除时间
        let clear_startDate = null;
        let clear_endDate = null;
        let tempClearTimeRange = [];
        if (condition.clearTimeRange.startDate) {
            clear_startDate = new Date(condition.clearTimeRange.startDate);
            tempClearTimeRange.push(clear_startDate);
        }
        if (condition.clearTimeRange.endDate) {
            clear_endDate = new Date(condition.clearTimeRange.endDate);
            tempClearTimeRange.push(clear_endDate);
        }
        this.clearTimeRange = tempClearTimeRange;

        //显示衍生告警
        this.showDerivedAlm = condition.showDerivedAlm;

        //备注信息
        this.remark_info = condition.remark;
        //客户信息
        this.client_info = condition.strClients;
        //工程状态
        if (condition.strProjectStatusString) {
            //包含0 则勾选非工程态
            if (condition.strProjectStatusString.indexOf('0') != -1) {
                this.un_engineering_state_checked = true;
            }
            //包含1 则勾选工程态
            if (condition.strProjectStatusString.indexOf('1') != -1) {
                this.engineering_state_checked = true;
            }

        }

        //震荡状态
        if (condition.strShockTypeString) {
            //包含0 则勾选非震荡
            if (condition.strShockTypeString.indexOf('0') != -1) {
                this.un_shock_checked = true;
            }
            //包含1 则勾选震荡状态
            if (condition.strShockTypeString.indexOf('1') != -1) {
                this.shock_checked = true;
            }
        }

        //持续时间
        if (condition.duration == 0) {
            //若持续时间为0，则不需勾选持续时间checkbox
            this.checked_last_time = false;
        } else {
            this.checked_last_time = true;
            //根据duration;计算持续时间
            let duration = condition.duration;
            this.dayValue = Math.floor(Math.floor(duration / 60) / 24);
            this.hourValue = Math.floor(duration / 60) % 24;
            this.minuteValue = duration % 60;
            if (condition.durationOperator == 0) {
                // 若操作符为0，则选择 <=
                this.selected_last_time_value = "<=";
            } else {
                this.selected_last_time_value = ">=";
            }

        }

    }
    alarmData: UnmAlarmModel[] = [];



    //表格所有可展示列
    colDataArray = [
        { "key": 0, "field": "", "title": "操作", "hiddenStatus": false },
        { "key": 1, "field": "levelName", "title": "级别", "hiddenStatus": false },
        { "key": 2, "field": "typeName", "title": "告警名", "hiddenStatus": false },
        // { "key": 3, "field": "typeNameEn", "title": "类型（en）", "hiddenStatus": false },
        { "key": 4, "field": "confirmTypeName", "title": "确认状态", "hiddenStatus": false },
        { "key": 5, "field": "clearTypeName", "title": "清除状态", "hiddenStatus": false },
        { "key": 6, "field": "objectName", "title": "告警源", "hiddenStatus": false },
        { "key": 7, "field": "extendedInfo", "title": "定位信息", "hiddenStatus": false },
        { "key": 8, "field": "frequency", "title": "频次", "hiddenStatus": false },
        { "key": 9, "field": "firstCreateTime", "title": "首次发生时间", "hiddenStatus": true },
        { "key": 10, "field": "latestCreateTime", "title": "最近发生时间", "hiddenStatus": true },
        //暂无durationCurrentAlm
        { "key": 11, "field": "durationCurrentAlm", "title": "持续时间", "hiddenStatus": true },
        { "key": 12, "field": "confirmTime", "title": "确认时间", "hiddenStatus": true },
        { "key": 13, "field": "confirmOperator", "title": "确认用户", "hiddenStatus": true },
        { "key": 14, "field": "clearTime", "title": "清除时间", "hiddenStatus": true },
        { "key": 15, "field": "clearOperator", "title": "清除用户", "hiddenStatus": true },
        { "key": 16, "field": "keyInfo", "title": "关键信息", "hiddenStatus": true },
        { "key": 17, "field": "appendInfo", "title": "附加信息", "hiddenStatus": true },
        { "key": 18, "field": "remark", "title": "备注信息", "hiddenStatus": true },
        { "key": 19, "field": "kindName", "title": "告警类型", "hiddenStatus": true },
        { "key": 21, "field": "neType", "title": "网元类型", "hiddenStatus": true },
        //暂无neRemark
        { "key": 21, "field": "neRemark", "title": "网元备注", "hiddenStatus": true },
        { "key": 22, "field": "linePort", "title": "线路端口", "hiddenStatus": true },
        { "key": 23, "field": "ectRoadCode", "title": "电路代码", "hiddenStatus": true },
        { "key": 24, "field": "linkName", "title": "链路名称", "hiddenStatus": true },
        { "key": 25, "field": "trailName", "title": "路径名称", "hiddenStatus": true },
        { "key": 26, "field": "psnName", "title": "保护子网", "hiddenStatus": true },
        { "key": 27, "field": "manageIp", "title": "IP", "hiddenStatus": true },
        { "key": 28, "field": "emuFistCreateTime", "title": "网管首次接收时间", "hiddenStatus": true },
        { "key": 29, "field": "emuLatestCreateTime", "title": "网管最近接收时间", "hiddenStatus": true },
        { "key": 30, "field": "emuClearTime", "title": "网管清除时间", "hiddenStatus": true },
        //暂无isEvent2AlarmIcon
        { "key": 31, "field": "isEvent2AlarmIcon", "title": "是否事件转告警", "hiddenStatus": true },
        { "key": 32, "field": "strPhySN", "title": "ONT物理SN", "hiddenStatus": true },
        { "key": 33, "field": "strPwd", "title": "ONT密码", "hiddenStatus": true },
        { "key": 34, "field": "strLogicSN", "title": "ONT逻辑SN", "hiddenStatus": true },
        { "key": 35, "field": "strLogicPwd", "title": "ONT逻辑密码", "hiddenStatus": true },
        { "key": 36, "field": "typeId", "title": "告警代码", "hiddenStatus": true },
    ];

    colDataArray2modify = [];//声明列定制中所有待修改的列信息
    modifyColArray = [];//维护穿梭框中修改了的列信息
    showColSelect = false;//是否显示列定制弹框

    //点击定制列事件
    clickColSelect() {
        this.showColSelect = true;
    }

    //初始化穿梭框中列信息
    initColDataArray2modify() {
        this.colDataArray2modify = [
            { "key": 1, "field": "levelName", "title": "级别", "direction": "left" },
            { "key": 2, "field": "typeName", "title": "告警名", "direction": "left" },
            // { "key": 3, "field": "typeNameEn", "title": "类型（en）", "direction": "left" },
            { "key": 4, "field": "confirmTypeName", "title": "确认状态", "direction": "left" },
            { "key": 5, "field": "clearTypeName", "title": "清除状态", "direction": "left" },
            { "key": 6, "field": "objectName", "title": "告警源", "direction": "left" },
            { "key": 7, "field": "extendedInfo", "title": "定位信息", "direction": "left" },
            { "key": 8, "field": "frequency", "title": "频次", "direction": "left" },
            { "key": 9, "field": "firstCreateTime", "title": "首次发生时间", "direction": "right" },
            { "key": 10, "field": "latestCreateTime", "title": "最近发生时间", "direction": "right" },
            { "key": 11, "field": "durationCurrentAlm", "title": "持续时间", "direction": "right" },
            { "key": 12, "field": "confirmTime", "title": "确认时间", "direction": "right" },
            { "key": 13, "field": "confirmOperator", "title": "确认用户", "direction": "right" },
            { "key": 14, "field": "clearTime", "title": "清除时间", "direction": "right" },
            { "key": 15, "field": "clearOperator", "title": "清除用户", "direction": "right" },
            { "key": 16, "field": "keyInfo", "title": "关键信息", "direction": "right" },
            { "key": 17, "field": "appendInfo", "title": "附加信息", "direction": "right" },
            { "key": 18, "field": "remark", "title": "备注信息", "direction": "right" },
            { "key": 19, "field": "kindName", "title": "告警类型", "direction": "right" },
            { "key": 21, "field": "neType", "title": "网元类型", "direction": "right" },
            { "key": 21, "field": "neRemark", "title": "网元备注", "direction": "right" },
            { "key": 22, "field": "linePort", "title": "线路端口", "direction": "right" },
            { "key": 23, "field": "ectRoadCode", "title": "电路代码", "direction": "right" },
            { "key": 24, "field": "linkName", "title": "链路名称", "direction": "right" },
            { "key": 25, "field": "trailName", "title": "路径名称", "direction": "right" },
            { "key": 26, "field": "psnName", "title": "保护子网", "direction": "right" },
            { "key": 27, "field": "manageIp", "title": "IP", "direction": "right" },
            { "key": 28, "field": "emuFistCreateTime", "title": "网管首次接收时间", "direction": "right" },
            { "key": 29, "field": "emuLatestCreateTime", "title": "网管最近接收时间", "direction": "right" },
            { "key": 30, "field": "emuClearTime", "title": "网管清除时间", "direction": "right" },
            { "key": 31, "field": "isEvent2AlarmIcon", "title": "是否事件转告警", "direction": "right" },
            { "key": 32, "field": "strPhySN", "title": "ONT物理SN", "direction": "right" },
            { "key": 33, "field": "strPwd", "title": "ONT密码", "direction": "right" },
            { "key": 34, "field": "strLogicSN", "title": "ONT逻辑SN", "direction": "right" },
            { "key": 35, "field": "strLogicPwd", "title": "ONT逻辑密码", "direction": "right" },
            { "key": 36, "field": "typeId", "title": "告警代码", "direction": "right" },
        ];
    }

    //穿梭框中列选择事件
    colSelectChange(event) {
        console.log(event);
        let tempArray = event.list;
        tempArray.forEach(element => {
            element.direction = event.to;
            this.addElement2modifyColArray(element);
        });
    }
    //内部方法，将修改的列元素维护至统一的数组中
    private addElement2modifyColArray(element) {
        let hasElement = false;
        for (let i = 0; i < this.modifyColArray.length; i++) {
            let temp = this.modifyColArray[i];
            //若已包含该元素，则只需更新direction状态
            if (temp.title == element.title) {
                temp.direction = element.direction;
                hasElement = true;
                break;
            }
        }
        //若不包含该元素，则添加至数组中
        if (!hasElement) {
            this.modifyColArray.push(element);
        }
    }

    //确定提交当前已修改的列定制信息
    confirmColSelect() {
        for (let i = 0; i < this.modifyColArray.length; i++) {
            let modifyElement = this.modifyColArray[i];
            for (let j = 0; j < this.colDataArray.length; j++) {
                let element = this.colDataArray[j];
                if (modifyElement.title == element.title) {
                    if (modifyElement.direction == 'right') {
                        element.hiddenStatus = true;
                    } else {
                        element.hiddenStatus = false;
                    }
                    break;
                }
            }
        }
        this.modifyColArray = [];
        this.showColSelect = false;
    }

    //取消提交当前已修改的列定制信息
    cancelColSelect() {
        this.modifyColArray = [];
        this.initColDataArray2modify();
        this.showColSelect = false;
    }

    export(type) {
        if (type == 'html') {

        } else if (type == 'excel') {

        }
    }

    //表格支持排序
    allowUnsort = true;
    multiple = false;
    alarmDataView = {
        data: this.alarmData,
        total: this.alarmData.length
    };
    public sort: SortDescriptor[];
    //列排序事件触发处理
    sortChange(sort: SortDescriptor[]) {
        console.log(sort);
        this.sort = sort;
        this.alarmDataView = {
            data: orderBy(this.alarmData, sort),
            total: this.alarmData.length
        };
    }
    //表格支持列过滤
    showFilter = false;
    clickFilter() {
        this.showFilter = !this.showFilter;
    }
    public state: State = {
        filter: {
            logic: 'and',
            filters: []
        }
    };
    //列过滤事件触发处理
    dataStateChange2filter(state: DataStateChangeEvent): void {
        console.log("*******");
        console.log(this.state);
        this.state = state;
        this.alarmDataView = process(this.alarmData, this.state);
    }
    table_loading = false;
    public pageSize = 10;
    public skip = 0;
    public buttonCount = 5;
    public info = true;
    public type: 'numeric' | 'input' = 'numeric';
    public pageSizes = [10, 50, 100, 200, 800];
    public previousNext = true;
    public pageChange(event: PageChangeEvent): void {
        console.log(event);
        this.pageSize = event.take;
        this.skip = event.skip;
        let pageIndex = Math.floor(this.skip / this.pageSize) + 1;
        let me = this;
        if (this.queryId == null) {
            return;
        }
        this.table_loading = true;
        console.log("2222222222");
        console.log("start query");
        console.log(new Date());
        this.alarmHttpService.queryCurrentAlms({
            queryId: this.queryId,
            pageIndex: pageIndex,
            pageSize: this.pageSize,
            condition: null
        }).then(
            (value: any) => {
                console.log("2222222222");
                console.log("receive data");
                console.log(new Date());
                let retAlarmData = value.content.alms;
                let total = value.content.total;
                me.alarmData = this.convertHttpResAlarmData(retAlarmData);
                me.alarmDataView = {
                    data: me.alarmData,
                    total: total
                };
                console.log("2222222222");
                console.log("end query");
                console.log(new Date());
                this.table_loading = false;
            },
            (desc: string) => {
                console.log(desc);
                this.table_loading = false;
            }
            );
    }


    //表格表头批量操作
    batchStatus = false;//默认批量操作状态为false；
    checkAllStatus = false;//默认全选状态
    batchClick() {
        this.batchStatus = !this.batchStatus;
    }

    //批量按钮选择所有
    checkAllChange(status) {
        console.log(status);
        this.alarmData.forEach((item: any) => {
            item.checkStatus = status;
        })
    }

    alarmDataCheckStatusChange(status, alarmData) {
        console.log(status);
        console.log(alarmData);
        alarmData.checkStatus = status;
    }
    showRemarkModal = false;
    inputRemarkInfo = "";
    cancelRemarkModal() {
        this.inputRemarkInfo = "";
        this.showRemarkModal = false;
    }

    /* remarkInfo结构为：
    {
    "alarmIdList": number[];
    "remark":string;
    }*/
    currentRemarkInfo = {
        "alarmData": [],
        "alarmIdList": [],
        "remark": ""
    };
    handleRemarkModal() {
        this.currentRemarkInfo.remark = this.inputRemarkInfo;
        this.sendRequest2remarkAlarms();
        this.inputRemarkInfo = "";
        this.showRemarkModal = false;
    }
    sendRequest2remarkAlarms() {
        this.alarmHttpService.remarkCurrentAlm(this.currentRemarkInfo).then(
            (value) => {
                //修改备注信息成功后，将前端缓存alarmData的备注信息也对应修改
                let alarmData = this.currentRemarkInfo.alarmData;
                let remark = this.currentRemarkInfo.remark;
                for (let i = 0; i < alarmData.length; i++) {
                    let item = alarmData[i];
                    item.remark = remark;
                }
            },
            (desc: string) => { console.log(desc) }
        );
    }

    alarmDataDetail(event) {
        console.log("*********");
        console.log(event);
    }

    batchAction(type) {
        let me = this;
        let idList = [];
        let actionAlarmDataList = [];
        this.alarmData.forEach((item: any) => {
            if (item.checkStatus) {
                idList.push(item.listId);
                actionAlarmDataList.push(item);
            }
        });
        if (idList.length == 0) {
            return;
        }
        if (type == "1") {
            this.alarmHttpService.confirmCurrentAlm(idList).then(
                (value) => {
                    me.alarmData.forEach((item: any) => {
                        item.confirmType = "1";
                    });
                },
                (desc: string) => { console.log(desc) }
            );

        } else if (type == "2") {
            this.alarmHttpService.unconfirmCurrentAlm(idList).then(
                (value) => {
                    me.alarmData.forEach((item: any) => {
                        item.confirmType = "0";
                    });
                },
                (desc: string) => { console.log(desc) }
            );


        } else if (type == "3") {
            if (idList.length == 0) {
                return;
            } else {
                this.currentRemarkInfo.alarmIdList = idList;
                this.currentRemarkInfo.alarmData = actionAlarmDataList;
                this.showRemarkModal = true;
            }

        } else if (type == "4") {
            this.alarmHttpService.clearCurrentAlm(idList).then(
                (value) => {
                    me.alarmData.forEach((item: any) => {
                        item.clearType = "2";
                    });
                },
                (desc: string) => { console.log(desc) }
            );

        }
    }


    //查看详情
    viewAlarmDetail(alarmData) {
        console.log(alarmData);
        this.context.setRouterParam(alarmData);
        this.router.navigate(['/unm-alarm/view/alarm-detail']);
    }

    //立即排查
    investigation(alarmData) {
        console.log(alarmData);
        this.context.setRouterParam(alarmData);
        this.router.navigate(['/unm-alarm/view/alarm-investigation']);
    }


    //type:1/确认告警，2/反确认告警，3/备注告警，4/清除告警
    click_alarm_action(alarmItem, type) {
        console.log(alarmItem);
        console.log(type);
        let me = this;
        let idList = [];
        if (type == "1") {
            idList.push(alarmItem.listId);
            this.alarmHttpService.confirmCurrentAlm(idList).then(
                (value) => {
                    console.log(value);
                    alarmItem.confirmType = "1";
                },
                (desc: string) => { console.log(desc) }
            );

        } else if (type == "2") {
            idList.push(alarmItem.listId);
            this.alarmHttpService.unconfirmCurrentAlm(idList).then(
                (value) => {
                    console.log(value);
                    alarmItem.confirmType = "0";
                },
                (desc: string) => { console.log(desc) }
            );


        } else if (type == "3") {
            idList.push(alarmItem.listId);
            let actionAlarmDataList = [];
            actionAlarmDataList.push(alarmItem);
            this.currentRemarkInfo.alarmData = actionAlarmDataList;
            this.currentRemarkInfo.alarmIdList = idList;
            this.showRemarkModal = true;
        } else if (type == "4") {
            idList.push(alarmItem.listId);
            this.alarmHttpService.clearCurrentAlm(idList).then(
                (value) => {
                    console.log(value);
                    alarmItem.clearType = "2";
                },
                (desc: string) => { console.log(desc) }
            );

        }

    }
    showSaveTemplate = false;//是否展示另存为模板弹出框
    saveTemplateName = "";//默认另存为模板的模板名
    //将当前条件添加为新的告警模板
    saveAsTemplate() {
        this.saveTemplateName = "";
        this.showSaveTemplate = true;
    }
    confirmSaveAsTemplate() {
        let condition = this.genCurrentCondition();
        console.log(condition);
        if (this.saveTemplateName && this.saveTemplateName != "") {
            let almTemplate = {
                templateName: this.saveTemplateName,
                almQueryCondition: condition
            };
            this.alarmHttpService.addCurrentAlmTemplate(almTemplate).then(
                (value) => {
                    console.log(value);
                    //完成另存为模板功能后，需重新查询更新当前可选模板信息
                    this.alarmCurrentTemplates = [];
                    this.alarmCurrentTemplates.push({ "templateName": "不使用" });
                    this.alarmHttpService.getAlarmTemplates().then(
                        (value: any) => {
                            value.forEach(element => {
                                if (element.templateTypeId == 1) {
                                    this.alarmCurrentTemplates.push(element);
                                }
                            })
                        },
                        (desc: string) => { console.log(desc) }
                    );
                },
                (desc: string) => { console.log(desc) }
            );

            this.showSaveTemplate = false;
        }
    }
    cancelSaveAsTemplate() {
        this.showSaveTemplate = false;
    }

    //将当前已选择条件汇总至condition模型
    genCurrentCondition(): UnmAlarmConditionModel {
        let condition = new UnmAlarmConditionModel();

        //告警级别
        let alarmLevels = [];
        if (this.alarm_level_0_checked) {
            alarmLevels = ["0", "1", "2", "3"];
        } else {
            if (this.alarm_level_1_checked) {
                alarmLevels.push("0");
            }
            if (this.alarm_level_2_checked) {
                alarmLevels.push("1");
            }
            if (this.alarm_level_3_checked) {
                alarmLevels.push("2");
            }
            if (this.alarm_level_4_checked) {
                alarmLevels.push("3");
            }
        }
        let alarmLevelsString = alarmLevels.join(',');
        condition.strLevels = alarmLevelsString;
        //告警状态
        let alarmStatus = [];
        if (this.alarm_status_0_checked) {
            //若选择所有，下发至后台时需下发所有
            alarmStatus = ["0", "1", "2", "3"];
        } else {
            if (this.alarm_status_1_checked) {
                alarmStatus.push("0");
            }
            if (this.alarm_status_2_checked) {
                alarmStatus.push("1");
            }
            if (this.alarm_status_3_checked) {
                alarmStatus.push("2");
            }
            if (this.alarm_status_4_checked) {
                alarmStatus.push("3");
            }
        }
        let alarmStatusString = alarmStatus.join(',');
        condition.strStatues = alarmStatusString;
        //告警发生时间
        let createTimeTemp = 0;
        let createTimeRangeTemp;
        if (this.current_select_alarm_occur_time == '0') {

        } else if (this.current_select_alarm_occur_time == '1') {
            createTimeTemp = 1 * 60;
        }
        else if (this.current_select_alarm_occur_time == '2') {
            createTimeTemp = 24 * 60;
        }
        else if (this.current_select_alarm_occur_time == '3') {
            createTimeTemp = 3 * 24 * 60;
        }
        else if (this.current_select_alarm_occur_time == '4') {
            createTimeTemp = 7 * 24 * 60;
        }
        else if (this.current_select_alarm_occur_time == '5') {
            createTimeRangeTemp = {
                "startDate": this.createTimeRange[0],
                "endDate": this.createTimeRange[1]
            }
        }
        condition.createTimeFromNowInMinutes = createTimeTemp;
        condition.createTimeRange = createTimeRangeTemp;

        //告警源
        console.log("66666666666666");
        console.log(this.alarm_source_single_select);
        console.log(this.alarmSourceValue_single);
        if (this.alarm_source_single_select) {
            //若当前为单选状态,且已选中某条告警源
            if (this.alarmSourceValue_single) {
                let almSourceBean = new AlmSourceModel();
                almSourceBean.allSelect = false;
                almSourceBean.sourceType = 1;
                almSourceBean.objBeans = [{
                    "type": "NE",
                    "typeId": 0,
                    "objId": {
                        "neId": this.alarmSourceValue_single.objId
                    }
                }]
                condition.almSourceBean = almSourceBean;
            }
        } else {
            //todo

        }
        // if (this.alarmSource_single_suggestions) {
        //   this.alarmSourceValue_single
        //   let almSourceModel = new AlmSourceModel();
        //   condition.almSourceBean = almSourceModel;
        // } else {
        //   this.alarmSourceValue_multiple
        // }
        // alarm_source_single_select = true;
        // alarmSource_single_suggestions = [];//告警源单选时可选列表
        // alarmSourceValue_single = ;//告警源单选时value
        // alarmSourceValue_multiple = [];//告警源多选时value
        // isAlarmSourceMultipleVisible = false;//多选框modal是否显示
        // alarmSourceMultipleInputValue = "";//多选框modal内输入网元名称
        // alarmSourceRadioValue = "1";//多选框内radio，默认选择1，按逻辑域
        // alarmSourceMultiNumber = 0;//多选框modal内已选择告警源数量

        //告警代码
        let alarmCodeArray = [];
        this.alarmCodeValue.forEach(ele => {
            alarmCodeArray.push(ele.alarmTypeCode);
        })
        condition.strAlmTypes = alarmCodeArray.join(',');

        //告警类型
        let alarmTypeSelected = [];
        this.select_alarm_type_options.forEach(ele => {
            alarmTypeSelected.push(ele.value);
        })
        condition.strKinds = alarmTypeSelected.join(',');

        //衍生告警
        condition.showDerivedAlm = this.showDerivedAlm;
        //持续时间
        if (this.checked_last_time) {
            if (this.selected_last_time_value == "<=") {
                condition.durationOperator = 0;
            } else {
                condition.durationOperator = 1;
            }
            condition.duration = this.dayValue * 24 * 60 + this.hourValue * 60 + this.minuteValue;
        }

        //确认用户
        if (this.select_confirm_user_options && this.select_confirm_user_options.length != this.confirmuser_dropdownOptions.length
        ) {//若无选中用户或选中所有用户，则不下发本属性
            let selectConfirmUseArray = [];
            this.select_confirm_user_options.forEach(ele => {
                selectConfirmUseArray.push(ele.label);
            })
            if (selectConfirmUseArray.length > 0) {


                condition.strConfirmUsers = selectConfirmUseArray.join(',');
            }

        }

        //清除用户
        if (this.select_clear_user_options && this.select_clear_user_options.length != this.clearuser_dropdownOptions.length
        ) {//若无选中用户或选中所有用户，则不下发本属性
            let selectClearUseArray = [];
            this.select_clear_user_options.forEach(ele => {
                selectClearUseArray.push(ele.label);
            })
            if (selectClearUseArray.length > 0) {
                condition.strClearUsers = selectClearUseArray.join(',');
            }
        }

        //确认时间
        if (this.confirmTimeRange.length > 0) {
            let confirmTime = {
                "startDate": this.confirmTimeRange[0],
                "endDate": this.confirmTimeRange[1]
            }
            condition.confirmTimeRange = confirmTime;
        }

        //清除时间
        if (this.clearTimeRange.length > 0) {
            let clearTime = {
                "startDate": this.clearTimeRange[0],
                "endDate": this.clearTimeRange[1]
            }
            condition.clearTimeRange = clearTime;
        }
        //清除类型
        let alarmClearTypeSelected = [];
        this.select_clear_type_options.forEach(ele => {
            alarmClearTypeSelected.push(ele.value);
        })
        condition.strClearType = alarmClearTypeSelected.join(',');

        //客户信息
        condition.strClients = this.client_info;

        //备注
        condition.remark = this.remark_info;

        //维护状态:工程态、非工程态
        let engineeringStateArray = [];
        if (this.engineering_state_checked) {
            engineeringStateArray.push('1');
        }
        if (this.un_engineering_state_checked) {
            engineeringStateArray.push('0');
        }
        condition.strProjectStatusString = engineeringStateArray.join(',');

        //重置震荡状态
        let shockStateArray = [];
        if (this.shock_checked) {
            shockStateArray.push('1');
        }
        if (this.un_shock_checked) {
            shockStateArray.push('0');
        }
        condition.strShockTypeString = shockStateArray.join(',');
        console.log(condition);
        return condition;
    }

    testIndex = 1;

    //根据选择条件查询当前告警信息
    query() {
        //1、重置当前表格信息
        this.alarmData = [];
        this.alarmDataView = {
            data: this.alarmData,
            total: this.alarmData.length
        };
        //2、取消之前订阅信息
        if (this.subscribeInfo) {
            this.wsService.unsubscribe(this.subscribeInfo);
        }

        //3、构造当前条件，下发查询订阅
        let condition = this.genCurrentCondition();
        console.log(condition);

        this.drawerVisible = false;
        let pageIndex = Math.floor(this.skip / this.pageSize) + 1;
        let me = this;
        this.table_loading = true;
        console.log("1111111111111111");
        console.log("start to query");
        console.log(new Date());
        this.alarmHttpService.queryCurrentAlms({
            queryId: null,
            pageIndex: pageIndex,
            pageSize: this.pageSize,
            condition: condition
        }).then(
            (value: any) => {
                me.queryId = value.content.queryId;
                me.subscribeInfo = me.wsService.subscribeByQueryId("/alm/currentAlm", me.queryId, (retValue: any) => {
                    console.log("1111111111111111");
                    console.log("receive data");
                    console.log(new Date());
                    let retAlarmData = JSON.parse(retValue.body);
                    /* if (me.alarmData && me.alarmData.length > 0) {
                         //若当前表格已展示了数据，则需计算待删除、待更新、待添加数据
                         let newAlarmData = me.convertAlarmData(retAlarmData.objects);
                         
                         //将当前表格已展示数据分为待删除、待更新两类
                          let alarmData2delete = [];
                          let alarmData2update = [];
  
                          for (let i = 0; i < me.alarmData.length; i++) {
                              let currentTableData = me.alarmData[i];
                              let exist = false;
                              for (let j = 0; j < newAlarmData.length; j++) {
                                  let newData = newAlarmData[j];
                                  if (currentTableData.alarmId == newData.alarmId) {
                                      //若当前表格数据在新推送数据中也存在，则放入待更新数组
                                      alarmData2update.push(currentTableData);
                                      exist = true;
                                      break;
                                  }
                              }
                              //若内层循环遍历结束仍未查找到对应数据，则当前表格数据在新推送数据中不存在
                              if (!exist) {
                                  alarmData2delete.push(currentTableData);
                              }
  
                          }
                          //将新推送数据分为待添加、待更新两类
                          let newAlarmData2add = [];
                          let newAlarmData2update = [];
  
                          for (let i = 0; i < newAlarmData.length; i++) {
                              let newData = newAlarmData[i];
                              let exist = false;
                              for (let j = 0; j < me.alarmData.length; j++) {
                                  let currentTableData = me.alarmData[j];
                                  if (currentTableData.alarmId == newData.alarmId) {
                                      //若新推送数据中在当前表格数据也存在，则放入待更新数组
                                      newAlarmData2update.push(newData);
                                      exist = true;
                                      break;
                                  }
                              }
                              //若内层循环遍历结束仍未查找到对应数据，则新推送数据在当前表格数据中不存在
                              if (!exist) {
                                  newAlarmData2add.push(newData);
                              }
  
                          }
  
                          console.log(alarmData2delete);
                          console.log(alarmData2update);
                          console.log(newAlarmData2add);
                          console.log(newAlarmData2update);
                          //更新数据
                          //1、将当前表格待更新数据字段使用新推送数据字段完成更新。
                          console.log("start to update table data,alarmData2update:" + alarmData2update + ",newAlarmData2update" + newAlarmData2update);
                          // for (let i = 0; i < alarmData2update.length; i++) {
                          //     let tableData = alarmData2update[i];
                          //     for (let j = 0; j < newAlarmData2update.length; j++) {
                          //         let newData = newAlarmData2update[j];
                          //         if (tableData.alarmId == newData.alarmId) {
                          //             //临时测试**********
                          //             newData.typeName = "test" + i + j;
                          //             me.mytable.editRow(i, newData);
                          //             break;
                          //         }
                          //     }
  
                          // }
  
                          console.log("end to update table data");
                          //2、使用表格删除方法删除当前表格中待删除数据alarmData2delete
                          console.log("start to delete table data,alarmData2delete:" + alarmData2delete);
  
                          console.log("end to delete table data");
                          //3、使用表格添加方法添加新推送数据中待添加数据newAlarmData2add
                          console.log("start to add table data,newAlarmData2add:" + newAlarmData2add);
                          console.log("end to add table data");
                          
                     } else {
                         me.alarmData = me.convertAlarmData(retAlarmData.objects);
                     }
                     */
                    me.alarmData = me.convertAlarmData(retAlarmData.objects);
                    me.alarmDataView = {
                        data: me.alarmData,
                        total: retAlarmData.total
                    };
                    console.log("1111111111111111");
                    console.log("end query");
                    console.log(new Date());
                    this.table_loading = false;
                    // me.testIndex++;
                    //测试代码，避免一直变化
                    // if (me.testIndex == 3) {
                    // me.wsService.unsubscribe(this.subscribeInfo);
                    // }

                })
            },
            (desc: string) => {
                console.log(desc);
                this.table_loading = false;
            }
            );
    }

    updateAlmObj(originalData, newData) {
        originalData.levelName = newData.levelName;
        originalData.confirmTypeName = newData.confirmTypeName;
        originalData.clearTypeName = newData.clearTypeName;
        originalData.typeName = newData.typeName;
        originalData.projectStatus = newData.projectStatus;
        originalData.kindName = newData.kindName;

        originalData.operType = newData.operType;
        originalData.oid = newData.oid;
        originalData.operationId = newData.operationId;
        originalData.alarmId = newData.alarmId;
        originalData.listId = newData.listId;
        originalData.preAlmId = newData.preAlmId;
        originalData.relatedAlmId = newData.relatedAlmId;
        originalData.businessId = newData.businessId;
        originalData.objectId = newData.objectId;
        originalData.objectInstanceType = newData.objectInstanceType;
        originalData.devTypeId = newData.devTypeId;
        originalData.lineId = newData.lineId;
        originalData.linePort = newData.linePort;
        originalData.infoHash = newData.infoHash;
        originalData.clearTime = newData.clearTime;
        originalData.clearOperator = newData.clearOperator;
        originalData.clearType = newData.clearType;
        originalData.confirmTime = newData.confirmTime;
        originalData.confirmOperator = newData.confirmOperator;
        originalData.confirmType = newData.confirmType;
        originalData.typeId = newData.typeId;
        originalData.kindId = newData.kindId;
        originalData.level = newData.level;
        originalData.almReason = newData.almReason;
        originalData.frequency = newData.frequency;
        originalData.firstCreateTime = newData.firstCreateTime;
        originalData.latestCreateTime = newData.latestCreateTime;
        originalData.keyInfo = newData.keyInfo;
        originalData.extendedInfo = newData.extendedInfo;
        originalData.lineNoInfo = newData.lineNoInfo;
        originalData.appendInfo = newData.appendInfo;
        originalData.remark = newData.remark;
        originalData.derivedFlag = newData.derivedFlag;
        originalData.neType = newData.neType;
        originalData.neId = newData.neId;
        originalData.ectRoadCode = newData.ectRoadCode;
        originalData.topLinkId = newData.topLinkId;
        originalData.client = newData.client;
        originalData.maintainStatus = newData.maintainStatus;
        originalData.emuFistCreateTime = newData.emuFistCreateTime;
        originalData.emuLatestCreateTime = newData.emuLatestCreateTime;
        originalData.emuClearTime = newData.emuClearTime;
        originalData.objectName = newData.objectName;
        originalData.linkName = newData.linkName;
        originalData.trailName = newData.trailName;
        originalData.affectedBusiness = newData.affectedBusiness;
        originalData.psnName = newData.psnName;
        originalData.hostIP = newData.hostIP;
        originalData.macInfo = newData.macInfo;
        originalData.loidInfo = newData.loidInfo;
        originalData.manageIp = newData.manageIp;
        originalData.confirmFlag = newData.confirmFlag;
        originalData.portUserName = newData.portUserName;
        originalData.uniPortID = newData.uniPortID;
        originalData.reverse1 = newData.reverse1;
        originalData.reverse2 = newData.reverse2;
        originalData.reverse3 = newData.reverse3;
        originalData.strPhySN = newData.strPhySN;
        originalData.strPwd = newData.strPwd;
        originalData.strLogicSN = newData.strLogicSN;
        originalData.strLogicPwd = newData.strLogicPwd;
        originalData.strBusinessID = newData.strBusinessID;
        originalData.strBusinessName = newData.strBusinessName;
        originalData.flashFlag = newData.flashFlag;
        originalData.millSecConfirmTime = newData.millSecConfirmTime;
        originalData.millSecClearTime = newData.millSecClearTime;
        originalData.millSecEmuClearTime = newData.millSecEmuClearTime;
        originalData.millSecEmuLatestCreateTime = newData.millSecEmuLatestCreateTime;
        originalData.millsSeclatestCreateTime = newData.millsSeclatestCreateTime;

        return;
    }
    queryId;//查询当前告警的queryId
    subscribeInfo;//全局缓存订阅信息,用于取消订阅

    convertHttpResAlarmData(serverAlarmData) {
        let ret: UnmAlarmModel[] = [];
        serverAlarmData.forEach(element => {
            let serverAlarm = element;
            let unmAlarmModel = this.convertServerAlmObj2ClientAlmObj(serverAlarm);
            ret.push(unmAlarmModel);
        })

        return ret;
    }
    convertAlarmData(serverAlarmData) {
        let ret: UnmAlarmModel[] = [];
        serverAlarmData.forEach(element => {
            let serverAlarm = element.object;
            let unmAlarmModel = this.convertServerAlmObj2ClientAlmObj(serverAlarm);
            ret.push(unmAlarmModel);
        })

        return ret;
    }

    convertServerAlmObj2ClientAlmObj(serverAlarm) {
        let unmAlarmModel = new UnmAlarmModel();
        /*以下将后端告警属性转换至前端新增属性 */
        switch (serverAlarm.level) {
            case 0: unmAlarmModel.levelName = "紧急"; break;
            case 1: unmAlarmModel.levelName = "主要"; break;
            case 2: unmAlarmModel.levelName = "次要"; break;
            case 3: unmAlarmModel.levelName = "提示"; break;

        }
        switch (serverAlarm.confirmType) {
            case 0: unmAlarmModel.confirmTypeName = "未确认"; break;
            case 1: unmAlarmModel.confirmTypeName = "用户确认"; break;

        }
        switch (serverAlarm.clearType) {
            case 0: unmAlarmModel.clearTypeName = "未清除"; break;
            case 1: unmAlarmModel.clearTypeName = "设备清除"; break;
            case 2: unmAlarmModel.clearTypeName = "用户清除"; break;
            case 3: unmAlarmModel.clearTypeName = "网管清除"; break;

        }
        unmAlarmModel.typeName = this.getAlarmByAlarmId(serverAlarm.typeId);
        unmAlarmModel.projectStatus = (serverAlarm.maintainStatus == 0) ? "非工程态" : "工程态";
        switch (serverAlarm.kindId) {
            case 0: unmAlarmModel.kindName = "通信质量"; break;
            case 1: unmAlarmModel.kindName = "环境告警"; break;
            case 2: unmAlarmModel.kindName = "设备故障"; break;
            case 3: unmAlarmModel.kindName = "服务质量"; break;
            case 4: unmAlarmModel.kindName = "处理错误告警"; break;
            case 5: unmAlarmModel.kindName = "安全告警"; break;

        }
        /*以下将后端告警属性转换至前端模型 */
        unmAlarmModel.operType = serverAlarm.operType;
        unmAlarmModel.oid = serverAlarm.oid;
        unmAlarmModel.operationId = serverAlarm.operationId;
        unmAlarmModel.alarmId = serverAlarm.alarmId;
        unmAlarmModel.listId = serverAlarm.listId;
        unmAlarmModel.preAlmId = serverAlarm.preAlmId;
        unmAlarmModel.relatedAlmId = serverAlarm.relatedAlmId;
        unmAlarmModel.businessId = serverAlarm.businessId;
        unmAlarmModel.objectId = serverAlarm.objectId;
        unmAlarmModel.objectInstanceType = serverAlarm.objectInstanceType;
        unmAlarmModel.devTypeId = serverAlarm.devTypeId;
        unmAlarmModel.lineId = serverAlarm.lineId;
        unmAlarmModel.linePort = serverAlarm.linePort;
        unmAlarmModel.infoHash = serverAlarm.infoHash;
        if (serverAlarm.clearTime) {
            unmAlarmModel.clearTime = new Date(serverAlarm.clearTime).toUTCString();
        }
        unmAlarmModel.clearOperator = serverAlarm.clearOperator;
        unmAlarmModel.clearType = serverAlarm.clearType;
        if (serverAlarm.confirmTime) {
            unmAlarmModel.confirmTime = new Date(serverAlarm.confirmTime).toUTCString();
        }
        unmAlarmModel.confirmOperator = serverAlarm.confirmOperator;
        unmAlarmModel.confirmType = serverAlarm.confirmType;
        unmAlarmModel.typeId = String(serverAlarm.typeId);
        unmAlarmModel.kindId = serverAlarm.kindId;
        unmAlarmModel.level = serverAlarm.level;
        unmAlarmModel.almReason = serverAlarm.almReason;
        unmAlarmModel.frequency = String(serverAlarm.frequency);
        if (serverAlarm.firstCreateTime) {
            unmAlarmModel.firstCreateTime = new Date(serverAlarm.firstCreateTime).toUTCString();
        }
        if (serverAlarm.latestCreateTime) {
            unmAlarmModel.latestCreateTime = new Date(serverAlarm.latestCreateTime).toUTCString();
        }
        unmAlarmModel.keyInfo = serverAlarm.keyInfo;
        unmAlarmModel.extendedInfo = serverAlarm.extendedInfo;
        unmAlarmModel.lineNoInfo = serverAlarm.lineNoInfo;
        unmAlarmModel.appendInfo = serverAlarm.appendInfo;
        unmAlarmModel.remark = serverAlarm.remark;
        unmAlarmModel.derivedFlag = serverAlarm.derivedFlag;
        unmAlarmModel.neType = String(serverAlarm.neType);
        unmAlarmModel.neId = serverAlarm.neId;
        unmAlarmModel.ectRoadCode = serverAlarm.ectRoadCode;
        unmAlarmModel.topLinkId = serverAlarm.topLinkId;
        unmAlarmModel.client = serverAlarm.client;
        unmAlarmModel.maintainStatus = serverAlarm.maintainStatus;
        if (serverAlarm.emuFistCreateTime) {
            unmAlarmModel.emuFistCreateTime = new Date(serverAlarm.emuFistCreateTime).toUTCString();
        }
        if (serverAlarm.emuLatestCreateTime) {
            unmAlarmModel.emuLatestCreateTime = new Date(serverAlarm.emuLatestCreateTime).toUTCString();
        }
        if (serverAlarm.emuClearTime) {
            unmAlarmModel.emuClearTime = new Date(serverAlarm.emuClearTime).toUTCString();
        }
        unmAlarmModel.objectName = serverAlarm.objectName;
        unmAlarmModel.linkName = serverAlarm.linkName;
        unmAlarmModel.trailName = serverAlarm.trailName;
        unmAlarmModel.affectedBusiness = serverAlarm.affectedBusiness;
        unmAlarmModel.psnName = serverAlarm.psnName;
        unmAlarmModel.hostIP = serverAlarm.hostIP;
        unmAlarmModel.macInfo = serverAlarm.macInfo;
        unmAlarmModel.loidInfo = serverAlarm.loidInfo;
        unmAlarmModel.manageIp = serverAlarm.manageIp;
        unmAlarmModel.confirmFlag = serverAlarm.confirmFlag;
        unmAlarmModel.portUserName = serverAlarm.portUserName;
        unmAlarmModel.uniPortID = serverAlarm.uniPortID;
        unmAlarmModel.reverse1 = serverAlarm.reverse1;
        unmAlarmModel.reverse2 = serverAlarm.reverse2;
        unmAlarmModel.reverse3 = serverAlarm.reverse3;
        unmAlarmModel.strPhySN = serverAlarm.strPhySN;
        unmAlarmModel.strPwd = serverAlarm.strPwd;
        unmAlarmModel.strLogicSN = serverAlarm.strLogicSN;
        unmAlarmModel.strLogicPwd = serverAlarm.strLogicPwd;
        unmAlarmModel.strBusinessID = serverAlarm.strBusinessID;
        unmAlarmModel.strBusinessName = serverAlarm.strBusinessName;
        unmAlarmModel.flashFlag = serverAlarm.flashFlag;
        unmAlarmModel.millSecConfirmTime = serverAlarm.millSecConfirmTime;
        unmAlarmModel.millSecClearTime = serverAlarm.millSecClearTime;
        unmAlarmModel.millSecEmuClearTime = serverAlarm.millSecEmuClearTime;
        unmAlarmModel.millSecEmuLatestCreateTime = serverAlarm.millSecEmuLatestCreateTime;
        unmAlarmModel.millsSeclatestCreateTime = serverAlarm.millsSeclatestCreateTime;

        return unmAlarmModel;
    }

    reset() {
        //重置模板选择信息
        this.selectedTemplate = null;
        this.resetCondition();
    }
    resetCondition() {
        //重置当前已选告警条件
        this.conditionArray = [];
        //重置告警级别
        this.alarm_level_0_checked = true;
        this.alarm_level_1_checked = false;
        this.alarm_level_2_checked = false;
        this.alarm_level_3_checked = false;
        this.alarm_level_4_checked = false;
        this.select_alarm_level_array = ['0'];
        //重置告警状态
        this.alarm_status_0_checked = true;
        this.alarm_status_1_checked = false;
        this.alarm_status_2_checked = false;
        this.alarm_status_3_checked = false;
        this.alarm_status_4_checked = false;
        this.select_alarm_status_array = ['0'];
        //重置告警发生时间
        this.alarm_occur_time_0_checked = true;
        this.alarm_occur_time_1_checked = false;
        this.alarm_occur_time_2_checked = false;
        this.alarm_occur_time_3_checked = false;
        this.alarm_occur_time_4_checked = false;
        this.alarm_occur_time_5_checked = false;
        this.createTimeRange = [new Date(), addDays(new Date(), 3)];//自定义时间范围
        this.alarmOccurTimeSelectChange(true, "0");
        this.alarm_occur_time_0_checked = true;
        this.current_select_alarm_occur_time = '0';
        //重置告警源
        //todo 多选
        this.alarmSourceValue_single = null;

        //重置告警代码
        this.alarmCodeValue.forEach(element => {
            element.selected = false;
        });
        this.alarmCodeValue = [];

        //重置确认用户、清除用户下拉列表
        this.resetUserOptions();

        //重置告警类型
        this.alarmType_dropdownOptions = [
            { "label": "通信质量", "value": "0", "selected": true },
            { "label": "环境告警", "value": "1", "selected": true },
            { "label": "设备故障", "value": "2", "selected": true },
            { "label": "服务质量", "value": "3", "selected": true },
            { "label": "处理错误告警", "value": "4", "selected": true },
            { "label": "安全告警", "value": "5", "selected": true }
        ];
        this.select_alarm_type_options = [
            { "label": "通信质量", "value": "0", "selected": true },
            { "label": "环境告警", "value": "1", "selected": true },
            { "label": "设备故障", "value": "2", "selected": true },
            { "label": "服务质量", "value": "3", "selected": true },
            { "label": "处理错误告警", "value": "4", "selected": true },
            { "label": "安全告警", "value": "5", "selected": true }
        ];
        //重置衍生告警
        this.showDerivedAlm = false;
        //重置持续时间
        this.checked_last_time = false;//是否勾选持续时间
        this.selected_last_time_value = '<=';//持续时间下拉菜单默认选择<=
        this.dayValue = 0;//默认值
        this.hourValue = 1;//默认值  
        this.minuteValue = 0;//默认值
        //重置确认时间
        this.confirmTimeRange = [];//确认时间

        //重置清除时间
        this.clearTimeRange = [];//清除时间
        //重置清除类型
        this.cleartype_dropdownOptions = [
            { "label": "未清除", "value": "0", "selected": true },
            { "label": "设备清除", "value": "1", "selected": true },
            { "label": "用户清除", "value": "2", "selected": true },
            { "label": "网管清除", "value": "3", "selected": true }
        ];
        this.select_clear_type_options = [
            { "label": "未清除", "value": "0", "selected": true },
            { "label": "设备清除", "value": "1", "selected": true },
            { "label": "用户清除", "value": "2", "selected": true },
            { "label": "网管清除", "value": "3", "selected": true }
        ];
        //重置客户信息
        this.client_info = "";//客户信息

        //重置备注
        this.remark_info = "";//备注信息

        //重置维护状态
        this.engineering_state_checked = false;
        this.un_engineering_state_checked = false;

        //重置震荡状态
        this.shock_checked = false;
        this.un_shock_checked = false;

    }


    drawerVisible = false;

    moreCondition() {
        this.drawerVisible = true;
    }

    close() {
        this.drawerVisible = false;
        // this.reflectTemplateCondition2eachCondition(this.selectedTemplate_condition);
    }

    alarm_level_0_checked = true;
    alarm_level_1_checked = false;
    alarm_level_2_checked = false;
    alarm_level_3_checked = false;
    alarm_level_4_checked = false;
    //已选告警级别:全部/紧急/主要/次要/提示,默认选中全部。
    select_alarm_level_array = ['0'];

    //告警全部按钮
    alarmLevelSelectAllChange(event) {
        if (event) {
            this.alarm_level_1_checked = false;
            this.alarm_level_2_checked = false;
            this.alarm_level_3_checked = false;
            this.alarm_level_4_checked = false;
            this.select_alarm_level_array.forEach((item) => {
                switch (item) {
                    case "1": this.deleteArrayElement(this.conditionArray, "紧急"); break;
                    case "2": this.deleteArrayElement(this.conditionArray, "主要"); break;
                    case "3": this.deleteArrayElement(this.conditionArray, "次要"); break;
                    case "4": this.deleteArrayElement(this.conditionArray, "提示"); break;
                }

            })
            this.select_alarm_level_array = ['0'];

        } else {
            this.deleteArrayElement(this.select_alarm_level_array, "0");
        }
    }

    //告警紧急、主要、次要、提示按钮
    alarmLevelSelectChange(event, tag) {
        //如果选中对应告警级别
        if (event) {
            if (this.select_alarm_level_array.indexOf('0') != -1) {
                this.alarm_level_0_checked = false;
                this.deleteArrayElement(this.select_alarm_level_array, "0");
            }
            switch (tag) {
                case "1": this.select_alarm_level_array.push("1"); this.conditionArray.push("紧急"); break;
                case "2": this.select_alarm_level_array.push("2"); this.conditionArray.push("主要"); break;
                case "3": this.select_alarm_level_array.push("3"); this.conditionArray.push("次要"); break;
                case "4": this.select_alarm_level_array.push("4"); this.conditionArray.push("提示"); break;
            }
        }
        //如果取消选中对应告警级别
        else {
            switch (tag) {
                case "1": this.deleteArrayElement(this.select_alarm_level_array, "1"); this.deleteArrayElement(this.conditionArray, "紧急"); break;
                case "2": this.deleteArrayElement(this.select_alarm_level_array, "2"); this.deleteArrayElement(this.conditionArray, "主要"); break;
                case "3": this.deleteArrayElement(this.select_alarm_level_array, "3"); this.deleteArrayElement(this.conditionArray, "次要"); break;
                case "4": this.deleteArrayElement(this.select_alarm_level_array, "4"); this.deleteArrayElement(this.conditionArray, "提示"); break;
            }
        }
    }

    alarm_status_0_checked = true;
    alarm_status_1_checked = false;
    alarm_status_2_checked = false;
    alarm_status_3_checked = false;
    alarm_status_4_checked = false;
    //已选告警类型:全部/未确认未清除/已确认未清除/未确认已清除/已确认已清除,默认选中全部。
    select_alarm_status_array = ['0'];

    //告警全部按钮
    alarmStatusSelectAllChange(event) {
        if (event) {
            this.alarm_status_1_checked = false;
            this.alarm_status_2_checked = false;
            this.alarm_status_3_checked = false;
            this.alarm_status_4_checked = false;
            this.select_alarm_status_array.forEach((item) => {
                switch (item) {
                    case "1": this.deleteArrayElement(this.conditionArray, "未确认未清除"); break;
                    case "2": this.deleteArrayElement(this.conditionArray, "已确认未清除"); break;
                    case "3": this.deleteArrayElement(this.conditionArray, "未确认已清除"); break;
                    case "4": this.deleteArrayElement(this.conditionArray, "已确认已清除"); break;
                }

            })
            this.select_alarm_status_array = ['0'];
        } else {
            this.deleteArrayElement(this.select_alarm_status_array, "0");
        }
    }

    //告警状态未确认未清除/已确认未清除/未确认已清除/已确认已清除按钮
    alarmStatusSelectChange(event, tag) {
        //如果选中对应告警状态
        if (event) {
            if (this.select_alarm_status_array.indexOf('0') != -1) {
                this.alarm_status_0_checked = false;
                this.deleteArrayElement(this.select_alarm_status_array, "0");
            }
            switch (tag) {
                case "1": this.select_alarm_status_array.push("1"); this.conditionArray.push("未确认未清除"); break;
                case "2": this.select_alarm_status_array.push("2"); this.conditionArray.push("已确认未清除"); break;
                case "3": this.select_alarm_status_array.push("3"); this.conditionArray.push("未确认已清除"); break;
                case "4": this.select_alarm_status_array.push("4"); this.conditionArray.push("已确认已清除"); break;
            }
        }
        //如果取消选中对应告警状态
        else {
            switch (tag) {
                case "1": this.deleteArrayElement(this.select_alarm_status_array, "1"); this.deleteArrayElement(this.conditionArray, "未确认未清除"); break;
                case "2": this.deleteArrayElement(this.select_alarm_status_array, "2"); this.deleteArrayElement(this.conditionArray, "已确认未清除"); break;
                case "3": this.deleteArrayElement(this.select_alarm_status_array, "3"); this.deleteArrayElement(this.conditionArray, "未确认已清除"); break;
                case "4": this.deleteArrayElement(this.select_alarm_status_array, "4"); this.deleteArrayElement(this.conditionArray, "已确认已清除"); break;
            }
        }
    }

    alarm_occur_time_0_checked = true;
    alarm_occur_time_1_checked = false;
    alarm_occur_time_2_checked = false;
    alarm_occur_time_3_checked = false;
    alarm_occur_time_4_checked = false;
    alarm_occur_time_5_checked = false;
    //已选告警发生时间:全部/最近1小时/最近24小时/最近3天/最近7天/自定义,默认选中全部。
    current_select_alarm_occur_time = '0';

    createTimeRange = [new Date(), addDays(new Date(), 3)];//自定义时间范围

    //告警发生时间:全部/最近1小时/最近24小时/最近3天/最近7天/自定义 按钮,所有按钮为互斥，选中后其他按钮状态需修改为未选中。
    alarmOccurTimeSelectChange(event, tag) {
        //如果选中对应告警发生时间
        if (event) {
            //1.将之前选中的告警发生选项从条件中清除，并将其选中状态改为false
            switch (this.current_select_alarm_occur_time) {
                case "0": this.alarm_occur_time_0_checked = false; break;
                case "1": this.deleteArrayElement(this.conditionArray, "最近1小时"); this.alarm_occur_time_1_checked = false; break;
                case "2": this.deleteArrayElement(this.conditionArray, "最近24小时"); this.alarm_occur_time_2_checked = false; break;
                case "3": this.deleteArrayElement(this.conditionArray, "最近3天"); this.alarm_occur_time_3_checked = false; break;
                case "4": this.deleteArrayElement(this.conditionArray, "最近7天"); this.alarm_occur_time_4_checked = false; break;
                case "5": this.deleteArrayElement(this.conditionArray, "自定义"); this.alarm_occur_time_5_checked = false; break;
            }
            this.current_select_alarm_occur_time = '0';
            //2.将当前选中的告警发生时间选项添加至本地数组维护。
            switch (tag) {
                case "0": this.current_select_alarm_occur_time = "0"; break;
                case "1": this.current_select_alarm_occur_time = "1"; this.conditionArray.push("最近1小时"); break;
                case "2": this.current_select_alarm_occur_time = "2"; this.conditionArray.push("最近24小时"); break;
                case "3": this.current_select_alarm_occur_time = "3"; this.conditionArray.push("最近3天"); break;
                case "4": this.current_select_alarm_occur_time = "4"; this.conditionArray.push("最近7天"); break;
                case "5": this.current_select_alarm_occur_time = "5"; this.conditionArray.push("自定义"); break;
            }
        }
        //如果取消选中对应告警发生时间
        else {
            switch (tag) {
                case "0": this.current_select_alarm_occur_time = "0"; break;
                case "1": this.current_select_alarm_occur_time = "1"; this.deleteArrayElement(this.conditionArray, "最近1小时"); break;
                case "2": this.current_select_alarm_occur_time = "2"; this.deleteArrayElement(this.conditionArray, "最近24小时"); break;
                case "3": this.current_select_alarm_occur_time = "3"; this.deleteArrayElement(this.conditionArray, "最近3天"); break;
                case "4": this.current_select_alarm_occur_time = "4"; this.deleteArrayElement(this.conditionArray, "最近7天"); break;
                case "5": this.current_select_alarm_occur_time = "5"; this.deleteArrayElement(this.conditionArray, "自定义"); break;
            }
        }
    }

    //告警源是否单选
    alarm_source_single_select = true;
    alarmSource_single_suggestions = [];//告警源单选时可选列表
    alarmSourceValue_single;//告警源单选时value
    alarmSourceValue_multiple = [];//告警源多选时value
    isAlarmSourceMultipleVisible = false;//多选框modal是否显示
    alarmSourceMultipleInputValue = "";//多选框modal内输入网元名称
    alarmSourceRadioValue = "1";//多选框内radio，默认选择1，按逻辑域
    alarmSourceMultiNumber = 0;//多选框modal内已选择告警源数量

    nodes2loginZone = [
        new NzTreeNode({
            title: 'root1',
            key: '1001',
            author: 'ANGULAR',
            expanded: true,
            children: [
                {
                    title: 'child1',
                    key: '10001',
                    author: 'ZORRO',
                    children: [
                        {
                            title: 'child1.1',
                            key: '100011',
                            author: 'ZORRO',
                            children: []
                        },
                        {
                            title: 'child1.2',
                            key: '100012',
                            author: 'ZORRO',
                            children: [
                                {
                                    title: 'grandchild1.2.1',
                                    key: '1000121',
                                    author: 'ZORRO-FANS',
                                    isLeaf: true,
                                    checked: true,
                                    disabled: true
                                },
                                {
                                    title: 'grandchild1.2.2',
                                    key: '1000122',
                                    author: 'ZORRO-FANS',
                                    isLeaf: true
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    ];

    nodes2position = [
        new NzTreeNode({
            title: 'root1',
            key: '1001',
            author: 'ANGULAR',
            expanded: true,
            children: [
                {
                    title: 'child1',
                    key: '10001',
                    author: 'ZORRO',
                    children: [
                        {
                            title: 'child1.1',
                            key: '100011',
                            author: 'ZORRO',
                            children: []
                        },
                        {
                            title: 'child1.2',
                            key: '100012',
                            author: 'ZORRO',
                            children: [
                                {
                                    title: 'grandchild1.2.1',
                                    key: '1000121',
                                    author: 'ZORRO-FANS',
                                    isLeaf: true,
                                    checked: true,
                                    disabled: true
                                },
                                {
                                    title: 'grandchild1.2.2',
                                    key: '1000122',
                                    author: 'ZORRO-FANS',
                                    isLeaf: true
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    ];

    treeCheckBoxChange() {
        if (this.alarmSourceRadioValue == "1") {
            this.alarmSourceMultiNumber = this.tree2logicZone.getCheckedNodeList().length;
        } else if (this.alarmSourceRadioValue == "2") {
            this.alarmSourceMultiNumber = this.tree2position.getCheckedNodeList().length;
        }

    }

    //切换当前单选/多选状态
    switchAlarmSourceSelectStatus() {
        if (this.alarm_source_single_select) {
            this.alarm_source_single_select = false;
            this.alarmSourceValue_multiple = [];
        } else {
            this.alarm_source_single_select = true;
            this.alarmSourceValue_single;
        }

    }

    alarmSourceMultipleOpen() {
        this.isAlarmSourceMultipleVisible = true;
    }

    cancelAlarmSourceMulti() {
        this.isAlarmSourceMultipleVisible = false;
    }

    confirmAlarmSourceMulti() {
        this.isAlarmSourceMultipleVisible = false;
        if (this.alarmSourceRadioValue == "1") {
            console.log(this.tree2logicZone.getCheckedNodeList());
        } else if (this.alarmSourceRadioValue == "2") {
            console.log(this.tree2position.getCheckedNodeList());
        }



    }

    alarmSourceMultipleReset() {

    }

    convertAlarmCodeValue2String(alarmCodeValue) {
        let retStr = "";
        for (let i = 0; i < alarmCodeValue.length; i++) {
            let element = alarmCodeValue[i];
            if (i == 0) {
                retStr += element.label;
            } else {
                retStr += "," + element.label;
            }
        }
        return retStr;
    }
    //告警代码可选列表
    alarmCodeOptions = [];
    alarmCodeValue = [];//告警代码value
    alarmCodeChange(item) {
        //1、先删除回显数组中告警代码信息
        //由于此时alarmCodeValue中数组已将item添加或删除了，因此要先获取之前的alarmCodeValue
        let alarmCodeValue_before = [];
        if (item.selected) {
            //若item此时变为了选中状态，则表示当前的alarmCodeValue中已经添加了该item，要获取alarmCodeValue_before，应在alarmCodeValue删除该item
            for (let i = 0; i < this.alarmCodeValue.length; i++) {
                let element = this.alarmCodeValue[i];
                if (element.alarmTypeCode != item.alarmTypeCode) {
                    alarmCodeValue_before.push(element);
                }
            }
        } else {
            //若item此时变为了未选中状态，则表示当前的alarmCodeValue中已经删除了该item，要获取alarmCodeValue_before，应在alarmCodeValue添加该item
            for (let i = 0; i < this.alarmCodeValue.length; i++) {
                let element = this.alarmCodeValue[i];
                alarmCodeValue_before.push(element);
            }
            alarmCodeValue_before.push(item);
        }


        let currentHuixianAlmCodeString_before = this.convertAlarmCodeValue2String(alarmCodeValue_before);
        for (var i = 0; i < this.conditionArray.length; i++) {
            if (this.conditionArray[i] == currentHuixianAlmCodeString_before) {
                this.conditionArray.splice(i, 1);
            }
        }
        //2、再根据最新数组中告警代码信息回显
        let huixianAlmCodeString = this.convertAlarmCodeValue2String(this.alarmCodeValue);
        if (huixianAlmCodeString) {
            this.conditionArray.push(huixianAlmCodeString);
        }


    }
    deleteArrayElement(array, element) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == element) {
                array.splice(i, 1);
                return array;
            }
        }
        return array;
    }

    //告警类型：通信质量/环境告警/设备故障/服务质量/处理错误告警/安全告警
    alarmType_dropdownOptions = [
        { "label": "通信质量", "value": "0", "selected": true },
        { "label": "环境告警", "value": "1", "selected": true },
        { "label": "设备故障", "value": "2", "selected": true },
        { "label": "服务质量", "value": "3", "selected": true },
        { "label": "处理错误告警", "value": "4", "selected": true },
        { "label": "安全告警", "value": "5", "selected": true }
    ];
    select_alarm_type_options = [
        { "label": "通信质量", "value": "0", "selected": true },
        { "label": "环境告警", "value": "1", "selected": true },
        { "label": "设备故障", "value": "2", "selected": true },
        { "label": "服务质量", "value": "3", "selected": true },
        { "label": "处理错误告警", "value": "4", "selected": true },
        { "label": "安全告警", "value": "5", "selected": true }
    ];


    showDerivedAlm = false;//是否显示衍生告警


    checked_last_time = false;//是否勾选持续时间
    alarm_last_time_options = [
        { 'label': '<=', 'value': '<=' },
        { 'label': '>=', 'value': '>=' },
    ]
    selected_last_time_value = '<=';//持续时间下拉菜单默认选择<=
    dayValue = 0;//默认值
    hourValue = 1;//默认值  
    minuteValue = 0;//默认值
    //确认用户属性
    confirmuser_dropdownOptions = [];
    select_confirm_user_options = [];

    confirmTimeRange = [];//确认时间
    clearTimeRange = [];//清除时间

    //清除类型属性
    cleartype_dropdownOptions = [
        { "label": "未清除", "value": "0", "selected": true },
        { "label": "设备清除", "value": "1", "selected": true },
        { "label": "用户清除", "value": "2", "selected": true },
        { "label": "网管清除", "value": "3", "selected": true }
    ];
    select_clear_type_options = [
        { "label": "未清除", "value": "0", "selected": true },
        { "label": "设备清除", "value": "1", "selected": true },
        { "label": "用户清除", "value": "2", "selected": true },
        { "label": "网管清除", "value": "3", "selected": true }
    ];

    //清除用户属性
    clearuser_dropdownOptions = [];
    select_clear_user_options = [];

    client_info = "";//客户信息
    remark_info = "";//备注信息

    //是否工程态告警
    engineering_state_checked = false;
    un_engineering_state_checked = false;

    //是否震荡状态
    shock_checked = false;
    un_shock_checked = false;


}
