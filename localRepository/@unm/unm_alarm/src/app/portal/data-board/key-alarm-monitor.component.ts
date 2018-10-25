import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { PushService } from "@waf_service/push";
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { UnmAlarmHttpService } from '../../service/unm-alarm-http.service';
import { orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { UnmAlarmModel } from '../../model/unm-alarm.model';
/**
 * @export
 * @class KeyAlarmMonitorComponent
 */
@Component({
    templateUrl: './key-alarm-monitor.component.html',
    styleUrls: ['./key-alarm-monitor.component.scss']
})
export class KeyAlarmMonitorComponent implements AfterViewInit {

    constructor(private wsService: PushService, private alarmHttpService: UnmAlarmHttpService) {

    }
    allAlarmTypeList = [];//用来全局缓存所有告警类型模型
    ngOnInit() {
        //初始化查询所有告警代码信息
        // this.alarmHttpService.getAlmTypes().then(
        //     (value: any) => {
        //         this.allAlarmTypeList = value;
        //     },
        //     (desc: string) => { console.log(desc) }
        // );
        // this.queryData();
    }
    ngAfterViewInit(): void {
    }
    queryId;//查询当前告警的queryId
    subscribeInfo;//全局缓存订阅信息,用于取消订阅
    alarmData: UnmAlarmModel[] = [];

    queryData() {
        let me = this;
        let pageIndex = Math.floor(this.skip / this.pageSize) + 1;
        this.alarmHttpService.queryCurrentAlms({
            queryId: null,
            pageIndex: pageIndex,
            pageSize: this.pageSize,
        }).then(
            (value: any) => {

                me.queryId = value.content.queryId;

                me.subscribeInfo = me.wsService.subscribeByQueryId("/alm/currentAlm", me.queryId, (retValue: any) => {
                    let retAlarmData = JSON.parse(retValue.body);
                    me.alarmData = me.convertAlarmData(retAlarmData.objects);
                    me.alarmDataView = {
                        data: me.alarmData,
                        total: retAlarmData.total
                    };
                    //测试代码，避免一直变化
                    if (retAlarmData.total >= 50) {
                        me.wsService.unsubscribe(this.subscribeInfo);
                    }

                })
            },
            (desc: string) => { console.log(desc) }
            );
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
        filter: null
    };
    //列过滤事件触发处理
    dataStateChange2filter(state: any): void {
        this.state = state;
        this.alarmDataView = process(this.alarmData, this.state);
    }
    public pageSize = 10;
    public skip = 0;
    public buttonCount = 5;
    public info = true;
    public type: 'numeric' | 'input' = 'numeric';
    public pageSizes = [10, 50, 100, 200];
    public previousNext = true;
    public pageChange(event: PageChangeEvent): void {
        console.log(event);
        this.pageSize = event.take;
        this.skip = event.skip;
        let pageIndex = Math.floor(this.skip / this.pageSize) + 1;
        let me = this;
        this.alarmHttpService.queryCurrentAlms({
            queryId: this.queryId,
            pageIndex: pageIndex,
            pageSize: this.pageSize,
            condition: null
        }).then(
            (value: any) => {
                let retAlarmData = value.content.alms;
                let total = value.content.total;
                me.alarmData = [];
                // this.convertHttpResAlarmData(retAlarmData);
                me.alarmDataView = {
                    data: me.alarmData,
                    total: total
                };

            },
            (desc: string) => { console.log(desc) }
            );
    }

    convertAlarmData(serverAlarmData) {
        let ret: UnmAlarmModel[] = [];
        serverAlarmData.forEach(element => {
            let serverAlarm = element.object;
            let unmAlarmModel = new UnmAlarmModel();
            /*以下将后端告警属性转换至前端新增属性 */
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
            unmAlarmModel.clearTime = new Date(serverAlarm.clearTime).toUTCString();
            unmAlarmModel.clearOperator = serverAlarm.clearOperator;
            unmAlarmModel.clearType = serverAlarm.clearType;
            unmAlarmModel.confirmTime = new Date(serverAlarm.confirmTime).toUTCString();
            unmAlarmModel.confirmOperator = serverAlarm.confirmOperator;
            unmAlarmModel.confirmType = serverAlarm.confirmType;
            unmAlarmModel.typeId = String(serverAlarm.typeId);
            unmAlarmModel.kindId = serverAlarm.kindId;
            unmAlarmModel.level = serverAlarm.level;
            unmAlarmModel.almReason = serverAlarm.almReason;
            unmAlarmModel.frequency = String(serverAlarm.frequency);
            unmAlarmModel.firstCreateTime = new Date(serverAlarm.firstCreateTime).toUTCString();
            unmAlarmModel.latestCreateTime = new Date(serverAlarm.latestCreateTime).toUTCString();
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
            unmAlarmModel.emuFistCreateTime = new Date(serverAlarm.emuFistCreateTime).toUTCString();
            unmAlarmModel.emuLatestCreateTime = new Date(serverAlarm.emuLatestCreateTime).toUTCString();
            unmAlarmModel.emuClearTime = new Date(serverAlarm.emuClearTime).toUTCString();
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

            ret.push(unmAlarmModel);
        })

        return ret;
    }

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
}
