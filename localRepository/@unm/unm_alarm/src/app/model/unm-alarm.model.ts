/**
 * unm_alarm模型
 * @export
 * @class UnmAlarmModel
 */
export class UnmAlarmModel {
    /*前台展示新增属性*/
    checkStatus: boolean = false;//每条告警数据checkBox选择状态
    levelName: string;//告警级别
    typeName: string;//告警类型名称
    kindName: string;//告警类型，与kindId对应
    clearTypeName: string;//告警清除状态名
    confirmTypeName: string;//告警清除状态名
    projectStatus: string;//告警工程态，与maintainStatus对应，maintainStatus为0，非工程态，为1则为工程态
    /*后台推送告警模型属性*/
    operType: string;
    oid: number;
    operationId: number;
    alarmId: number;
    listId: number;
    preAlmId: number;
    relatedAlmId: number;
    businessId: number;
    objectId: number;
    objectInstanceType: number;
    devTypeId: number;
    lineId: number;
    linePort: string;
    infoHash: number;
    clearTime: string;//后台返回为date，前端为简化列过滤，转为string
    clearOperator: string;
    clearType: number;
    confirmTime: string;//后台返回为date，前端为简化列过滤，转为string
    confirmOperator: string;
    confirmType: number;
    typeId: string;//后台返回为number，前端为简化列过滤，转为string
    kindId: number;
    level: number;
    almReason: string;
    frequency: string;//后台返回为number，前端为简化列过滤，转为string
    firstCreateTime: string;//后台返回为date，前端为简化列过滤，转为string
    latestCreateTime: string;//后台返回为date，前端为简化列过滤，转为string
    keyInfo: string;
    extendedInfo: string;
    lineNoInfo: string;
    appendInfo: string;
    remark: string;
    derivedFlag: number;
    neType: string;//后台返回为number，前端为简化列过滤，转为string
    neId: number;
    ectRoadCode: string;
    topLinkId: number;
    client: string;
    maintainStatus: number;
    emuFistCreateTime: string;//后台返回为date，前端为简化列过滤，转为string
    emuLatestCreateTime: string;//后台返回为date，前端为简化列过滤，转为string
    emuClearTime: string;//后台返回为date，前端为简化列过滤，转为string
    objectName: string;
    linkName: string;
    trailName: string;
    affectedBusiness: string;
    psnName: string;
    hostIP: string;
    macInfo: string;
    loidInfo: string;
    manageIp: string;
    confirmFlag: string;
    portUserName: string;
    uniPortID: string;
    reverse1: number;
    reverse2: number;
    reverse3: number;
    strPhySN: string;
    strPwd: string;
    strLogicSN: string;
    strLogicPwd: string;
    strBusinessID: string;
    strBusinessName: string;
    flashFlag: number;
    millSecConfirmTime: number;
    millSecClearTime: number;
    millSecEmuClearTime: number;
    millSecEmuLatestCreateTime: number;
    millsSeclatestCreateTime: number;
}



/**
 * unm_alarm_condition模型
 * @export
 * @class UnmAlarmModel
 */
export class UnmAlarmConditionModel {
    strAlmTypes: string;
    strLevels: string;
    strStatues: string;
    strKinds: string;
    confirmTimeRange: {
        startDate: any;
        endDate: any
    };
    almSourceBean: AlmSourceModel;
    createTimeFromNowInMinutes: number;
    createTimeRange: {
        startDate: any;
        endDate: any
    };
    clearTimeRange: {
        startDate: any;
        endDate: any
    };
    duration: number;
    durationOperator: number;
    remark: string;
    showDerivedAlm: boolean;
    strConfirmUsers: string
    strClearUsers: string;
    strClients: string;
    strClearType: string;
    strShockTypeString: string;
    strProjectStatusString: string;

}
export class AlmSourceModel {
    allSelect: boolean = true;
    sourceType: number;
    objBeans: any;
    singleObject: any;
}

export enum AlarmTemplateType {
    CurrentAlarm = 1,
    HistoryAlarm = 2,

}



