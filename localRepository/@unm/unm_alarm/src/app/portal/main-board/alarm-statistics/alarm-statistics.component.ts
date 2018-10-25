import { Component } from '@angular/core';
import { constant } from '../../../unm-alarm.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { UnmAlarmHttpService } from '../../../service/unm-alarm-http.service';
import { NzMessageService } from 'ng-zorro-antd';
/**
 * alarm-statistics
 * @export
 * @class AlarmStatisticsComponent
 */
@Component({
    templateUrl: './alarm-statistics.component.html',
    styleUrls: ['./alarm-statistics.component.scss']
})
export class AlarmStatisticsComponent {

    /**
     * 构造函数
     * @param {LoggerService} logger
     * @param {ContextService} context
     * @memberof UnmAlarmModule
     */
    constructor(private message: NzMessageService, private alarmHttpService: UnmAlarmHttpService, private logger: LoggerService, private context: ContextService) {
        this.initEventListener();

    }

    initEventListener() {
        //监听到首页shortcut初始化后提供告警统计信息
        this.context.subscribe("event.alarm.statictic", (alarmStatisticData) => {

            return new Promise((resolve, reject) => {
                console.log("********")
                console.log(alarmStatisticData);

                for (let i = 0; i < this.userTemplateArray.length; i++) {
                    let template = this.userTemplateArray[i];
                    for (let j = 0; j < alarmStatisticData.length; j++) {
                        let temp = alarmStatisticData[j];
                        if (temp.object && temp.object.queryID == template.templateId) {
                            template.criticalNum = temp.object.criticalItemBean.totalCount;
                            template.majorNum = temp.object.majorItemBean.totalCount;
                            template.minorNum = temp.object.minorItemBean.totalCount;
                            template.warningNum = temp.object.warningItemBean.totalCount;
                            template.total = template.criticalNum + template.majorNum
                                + template.minorNum + template.warningNum
                            template.unconfirmNum =
                                temp.object.criticalItemBean.unconfirmAndUnclear
                                + temp.object.criticalItemBean.unconfirmAndCleared
                                + temp.object.majorItemBean.unconfirmAndUnclear +
                                temp.object.majorItemBean.unconfirmAndCleared
                                + temp.object.minorItemBean.unconfirmAndUnclear
                                + temp.object.minorItemBean.unconfirmAndCleared
                                + temp.object.warningItemBean.unconfirmAndUnclear
                                + temp.object.warningItemBean.unconfirmAndCleared;
                            template.unclearNum =
                                temp.object.criticalItemBean.unconfirmAndUnclear
                                + temp.object.criticalItemBean.confirmedAndUnclear
                                + temp.object.majorItemBean.unconfirmAndUnclear +
                                temp.object.majorItemBean.confirmedAndUnclear
                                + temp.object.minorItemBean.unconfirmAndUnclear
                                + temp.object.minorItemBean.confirmedAndUnclear
                                + temp.object.warningItemBean.unconfirmAndUnclear
                                + temp.object.warningItemBean.confirmedAndUnclear;
                            break;
                        }
                    }

                }

                resolve();
            });
        });

    }
    allTemplateArray = [];//所有模板信息
    userTemplateArray = [];//当前需展示的用户模板信息
    selectTemplateOptions = [];//下拉列表可添加模板信息
    ngOnInit() {
        //初始化查询当前用户告警模板信息
        this.alarmHttpService.getUserAlarmTemplates().then(
            (value) => {
                this.userTemplateArray = this.convertTemplate(value);
                //初始化查询所有告警模板信息
                this.alarmHttpService.getAlarmTemplates().then(
                    (value) => {
                        this.allTemplateArray = this.convertTemplate(value);
                        //获取当前用户统计模板及所有模板信息后，对比获取可选添加监控的模板信息
                        this.getSelectTemplateOptions();
                    },
                    (desc: string) => { console.log(desc) }
                );
            },
            (desc: string) => { console.log(desc) }
        );
    }

    getSelectTemplateOptions() {
        let tempArray = [];
        for (let i = 0; i < this.allTemplateArray.length; i++) {
            let temp = this.allTemplateArray[i];
            let hasTemp = false;
            for (let j = 0; j < this.userTemplateArray.length; j++) {
                let element = this.userTemplateArray[j];
                if (element.templateId == temp.templateId) {
                    hasTemp = true;
                    break;
                }
            }
            if (!hasTemp) {
                tempArray.push(temp);
            }
        }
        this.selectTemplateOptions = this.convertTemplate(tempArray);
    }

    convertTemplate(templateList) {
        let ret = [];
        templateList.forEach(element => {
            let temp = new TemplateModel();
            temp.templateName = element.templateName;
            temp.templateId = element.templateId;
            temp.isCurAlarmMonitorTemplate = element.isCurAlarmMonitorTemplate;
            temp.isDefaultCurAlarmMonitorTemplate = element.isDefaultCurAlarmMonitorTemplate;
            ret.push(temp);
        });
        return ret;

    }


    alarmLightStaus = true;
    changeAlarmLight(event) {
        console.log(event);
        if (event) {
            //若设置闪烁告警灯为true
            let alarmFlash = new Map<number, boolean>();
            alarmFlash.set(2010100, true);
            alarmFlash.set(2010102, true);
            alarmFlash.set(2010107, true);
            this.context.setSupervisoryInfo(null, alarmFlash);
        } else {
            //若设置闪烁告警灯为false
            let alarmFlash = new Map<number, boolean>();
            alarmFlash.set(2010100, false);
            alarmFlash.set(2010102, false);
            alarmFlash.set(2010107, false);

            this.context.setSupervisoryInfo(null, alarmFlash);
        }
    }

    cols = [
        { "field": "templateName", "title": "模板名" },
        { "field": "total", "title": "总数" },
        { "field": "criticalNum", "title": "紧急" },
        { "field": "majorNum", "title": "主要" },
        { "field": "minorNum", "title": "次要" },
        { "field": "warningNum", "title": "提示" },
        { "field": "unconfirmNum", "title": "未确认" },
        { "field": "unclearNum", "title": "未清除" },
        { "field": "", "title": "操作" },
    ]

    setTemplate2default(selectTemplate) {
        console.log(selectTemplate);

        this.alarmHttpService.setCurMonitorTemplate(selectTemplate.templateId).then(
            (value) => {
                console.log(value);
                //1、设置成功后，更新本地缓存的模板信息，将之前的默认模板修改为非默认，并将本次设置的模板修改为默认
                for (let i = 0; i < this.userTemplateArray.length; i++) {
                    let element = this.userTemplateArray[i];
                    if (element.templateId != selectTemplate.templateId && element.isDefaultCurAlarmMonitorTemplate == 1) {
                        element.isDefaultCurAlarmMonitorTemplate = 0;
                        break;
                    }
                }
                selectTemplate.isDefaultCurAlarmMonitorTemplate = 1;
                //联动更新shortcut上的当前默认告警信息数据
                let alarmNo = new Map<number, number>();
                // alarmNo.set(2010100, 10);//重点告警监控信息
                alarmNo.set(2010101, selectTemplate.criticalNum);//紧急告警信息
                alarmNo.set(2010102, selectTemplate.majorNum);//主要告警信息
                alarmNo.set(2010103, selectTemplate.minorNum);//次要告警信息
                alarmNo.set(2010104, selectTemplate.warningNum);//提示告警信息
                // alarmNo.set(2010106, 60);//中断提示告警信息
                // alarmNo.set(2010107, 70);//预警提示告警信息

                this.context.setSupervisoryInfo(alarmNo, null);
                //2、设置为默认后，需联动修改更新主面板显示数据
                //to-do
            },
            (desc: string) => { console.log(desc) }
        );
    }

    deleteUserStatisticTemplate(selectTemplate) {
        console.log(selectTemplate);
        let me = this;
        let idList = [];
        idList.push(selectTemplate.templateId);
        this.alarmHttpService.unsetMonitorTempls(idList).then(
            (value) => {
                console.log(value);
                this.selectTemplateOptions.push(selectTemplate);
                for (let i = 0; i < this.userTemplateArray.length; i++) {
                    let element = this.userTemplateArray[i];
                    if (element.templateId == selectTemplate.templateId) {
                        this.userTemplateArray.splice(i, 1);
                    }
                }
            },
            (desc: string) => { console.log(desc) }
        );
    }


    addUserStatisticTemplate(selectTemplate) {
        console.log("****");
        console.log(selectTemplate);
        //用户当前告警监控模板最多5个
        if (this.userTemplateArray.length == 5) {
            this.message.success('用户监控模板不能大于5个', { nzDuration: 3000 });
            return;
        }
        let me = this;
        let idList = [];
        idList.push(selectTemplate.templateId);
        this.alarmHttpService.setMonitorTempls(idList).then(
            (value) => {
                console.log(value);
                this.userTemplateArray.push(selectTemplate);
                for (let i = 0; i < this.selectTemplateOptions.length; i++) {
                    let element = this.selectTemplateOptions[i];
                    if (element.templateId == selectTemplate.templateId) {
                        this.selectTemplateOptions.splice(i, 1);
                    }
                }
            },
            (desc: string) => { console.log(desc) }
        );
    }
}

//用于告警统计功能的模板模型
export class TemplateModel {
    templateName: string;
    templateId: number;
    isCurAlarmMonitorTemplate: number;//0：非当前告警统计模板，1：当前用户告警统计模板
    isDefaultCurAlarmMonitorTemplate: number;//0：非默认告警统计模板，1：默认告警统计模板

    //用于前端展示的属性
    total: number = NaN;
    criticalNum: number = NaN;
    majorNum: number = NaN;
    minorNum: number = NaN;
    warningNum: number = NaN;
    unconfirmNum: number = NaN;
    unclearNum: number = NaN;
}

