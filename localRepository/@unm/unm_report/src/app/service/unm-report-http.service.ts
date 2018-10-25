import { Injectable } from "@angular/core";
import { DatePipe } from '@angular/common';

import { NzTreeNode } from 'ng-zorro-antd';

import { PushService } from "@waf_service/push";
import { HttpService, RequestMsg } from "@waf_service/http";
import { res } from "../model/mock-res";
import { ContextService } from "@waf_service/context";

/**
 * 地址配置
 */
export const URLConfigs = {
  "distributions": "/report/queryAllStatisticsData", //全网分布
  "objects": "/cm/queryUserMgrObjectTree", //对象树列表
  "neTypes": "/report/queryAllNeType", //网元类型列表
  "boardTypes": "/report/querySinglePlateType", //单盘类型列表
  "shelfTypes": "/report/queryAllShelfType", //框类型列表
  "deviceTypes": "/report/queryAllDeviceType", //设备类型列表
  "statistics": "/report/queryReportStatistics", //报表统计
  "export": "/report/reportWriteFile", //全部导出
  "exportSelected": "/report/exportReportBySelected", //部分导出
  "exportStream": "/report/reportExport/", //导出流  
  "websocket": "/report/ws",//推送监听
  "port": "/report/queryPort",
  "ne": "/report/queryNe",
  "board": "/report/querySinglePlate",
  "shelf": "/report/queryBox",
  "slot": "/report/querySlot",
  "omodule": "/report/queryOpticalModule",
};

/**
 * 查询请求结构
 * @param {pageIndex} 页码
 * @param {pageSize} 页大小
 * @param {firstQuery} 第一次查询还是页数据查询
 * @param {queryId} 查询ID
 */
export const QueryDataModels = {
  "port": {
    "objectId": "objectId",
    "portType": "portType",
    "portName": "portName",
    "portRate": "portRate",
    "portLabel": "portLabel",
    "usage": "usage"
  },
  "ne": {
    "objectId": "objectId",
    "neType": "selectType",
    "neId": "neId",
    "createTime": "dateRange",
    "neIp": "neIP",
    "neVersion": "selectVersion",
    "neSnNum": "neSN",
    "userLabel": "userLabel",
    "status": "manStatus"
  },
  "board": {
    "objectId": "objectId",
    "plateType": "selectType",
    "plateName": "boardName",
    "createTime": "dateRange",
    "equipmentType": "selectType1",
    "neName": "neName",
    "neIp": "neIP",
    "plateNum": "boardSN",
    "status": "manStatus"
  },
  "shelf": {
    "objectId": "objectId",
    "boxType": "selectType",
    "boxName": "shelfName",
    "bureau": "belongsDepart",
    "rack": "belongsRack",
    "rackNum": "rackID"
  },
  "slot": {
    "objectId": "objectId"
  },
  "omodule": {
    "objectId": "objectId",
    "moduleType": "selectType",
    "plateType": "selectType1",
    "equipmentType": "selectType2",
    "rate": "selectType3",
    "sn": "SN"
  },
};

/**
 * 统计请求结构
 * @param {columns} 统计字段
 * @param {reportId} 统计类型
 */
export const StatisticsDataModels = {
  "port": {
    "columns": [],
    "reportId": 6
  },
  "ne": {
    "columns": [],
    "reportId": 5
  },
  "board": {
    "columns": [],
    "reportId": 2
  },
  "shelf": {
    "columns": [],
    "reportId": 1
  },
  "slot": {
    "columns": [],
    "reportId": 3
  },
  "omodule": {
    "columns": [],
    "reportId": 4
  },
};

/**
 * 导出请求结构
 * @param {type} 导出文件类型，html、excel
 * @param {queryId} 要导出的查询ID
 * @param {reportId} 数据类型
 */
export const ExportDataModels = {
  "port": {
    "type": "",
    "queryId": "",
    "reportId": 6
  },
  "ne": {
    "type": "",
    "queryId": "",
    "reportId": 5
  },
  "board": {
    "type": "",
    "queryId": "",
    "reportId": 2
  },
  "shelf": {
    "type": "",
    "queryId": "",
    "reportId": 1
  },
  "slot": {
    "type": "",
    "queryId": "",
    "reportId": 3
  },
  "omodule": {
    "type": "",
    "queryId": "",
    "reportId": 4
  },
};

/**
 * unm_report网络服务
 * @export
 * @class UnmReportHttpService
 */
@Injectable()
export class UnmReportHttpService {
  fakeRes = res;
  // 查询ID
  queryId: string;
  // 统计ID
  statisticsId: string;
  /**
   * 构造函数
   * @param pushService websocket 服务
   * @param http http 服务
   */
  constructor(private pushService: PushService, private httpService: HttpService, private context: ContextService, private datePipe: DatePipe) { }
  /**
   * 根据key值获取国际化后的字符串
   * @param {string} key
   * @returns {string} 
   */
  getI18n(key: string): string {
    let str = "";
    this.context.getI18n(key).subscribe((value) => {
      str = value;
    })
    return str;
  }

  /**
   * 格式化日期
   * @param date 日期对象
   * @param format 目标格式
   */
  transformDate(date, format) {
    console.log(date);
    return this.datePipe.transform(date, format);
  }
  /**
   * 发起查询
   */
  openQuery(TYPE, formValue, callback) {
    let request = new RequestMsg();
    // request.res = '/report/queryPort';
    request.res = URLConfigs[TYPE]
    // request.isDefRespProcess = false;
    let _conditions = {};
    for (const key in QueryDataModels[TYPE]) {
      if (QueryDataModels[TYPE].hasOwnProperty(key)) {
        let _key = QueryDataModels[TYPE][key];
        _conditions[key] = formValue[_key];
      }
    }
    request.content = Object.assign({ "firstQuery": true, "pageIndex": "", "pageSize": "", "queryId": 0, }, _conditions)
    this.httpService.post(request).then((res) => {
      this.queryId = res.content.queryId;
      callback({ body: "query OK!" });
      this.pushService.subscribeByQueryId(URLConfigs["websocket"], res.content.queryId, callback);
    });
  }

  /**
   * 发起统计
   */
  openStatistics(TYPE, columns, callback) {
    let request = new RequestMsg();
    // request.res = '/report/queryPort';
    request.res = URLConfigs["statistics"];
    // request.isDefRespProcess = false;
    let _conditions = StatisticsDataModels[TYPE];
    _conditions["columns"] = columns;
    request.content = _conditions;
    this.httpService.post(request).then((res) => {
      this.statisticsId = res.content.queryId;
      this.pushService.subscribeByQueryId(URLConfigs["websocket"], res.content.queryId, callback);
    });
  }

  /**
   * 页面数据查询
   */
  queryPage(TYPE, pageIndex, pageSize, callback) {
    let request = new RequestMsg();
    request.res = URLConfigs[TYPE];
    // request.isDefRespProcess = false;
    request.content = {
      "firstQuery": false,
      "queryId": this.queryId,
      "pageIndex": pageIndex,
      "pageSize": pageSize,
    };
    this.httpService.post(request).then(callback);
  }

  /**
   * ws数据解析
   */
  getFormatedResult(data, pageSize?) {
    if (data === "query OK!") {
      return { data: [], total: 0 }
    }
    let res = JSON.parse(data);
    let result = { data: [], total: 0 };
    let t = 0;
    if (pageSize != undefined && pageSize < res.objects.length) {
      t = pageSize;
    } else {
      t = res.objects.length;
    }
    result.total = res.total;
    for (let i = 0; i < t; i++) {
      let row = res.objects[i].object.row;
      result.data.push(row);
      row = null;
    }
    return result;
  }

  /**
   * 单页数据解析
   */
  getFormatedPage(data) {
    if (typeof (data) === "string") {
      data = JSON.parse(data);
    }
    let res = data;
    let result = { data: [], total: 0 };
    result.total = res.content.data.length;
    let objects = res.content.data;
    for (let i = 0; i < objects.length; i++) {
      let row = objects[i].row;
      result.data.push(row);
      row = null;
    }
    return result;
  }

  /**
   * 导出数据
   * @param {rows} 可选参数，表示选中行
   */
  exportData(TYPE, fileType, callback, rows?: any[]) {
    let request = new RequestMsg();
    request.res = URLConfigs["export"];
    let _conditions = ExportDataModels[TYPE];
    _conditions["type"] = fileType;
    _conditions["queryId"] = this.queryId;
    // 是否是选中导出
    if (rows != undefined && rows.length > 0) {
      request.res = URLConfigs["exportSelected"];
      _conditions["indexArr"] = rows;
    }
    request.content = _conditions;
    this.getFile(request, TYPE, fileType, callback);
  }

  /**
   * 导出文件下载
   */
  getFile(request, TYPE, fileType, callback) {
    // request.isDefRespProcess = false;
    this.httpService.post(request).then((res) => {
      const fileExt = {
        "html": "html",
        "excel": "xlsx"
      };
      const MIMEType = {
        "html": "application/zip",
        "excel": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }
      // 截取文件名
      let fileName = "";
      // html无法直接下载，改为zip后缀
      // url带文件名且不为zip时直接使用该文件名，否则手动生成文件名。
      if (res.content.match(/\.zip$/) === null && res.content.match(/\w+\.\w+$/) != null) {
        fileName = res.content.match(/[^\/]+\.\w+$/)[0];
      } else {
        // TODO download属性无法按预期更改文件名，直接使用收到的文件名
        let _a = new Date;
        fileName = String(TYPE) + "Export" + _a.getFullYear() + (_a.getMonth() + 1) + _a.getDate() + "-" + Math.floor((Math.random() * 100) + 1) + "." + fileExt[fileType];
      }

      let a = document.createElement('a');
      let url = res.content;
      a.href = url;
      a.download = fileName;
      a.type = MIMEType[fileType];
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      callback();


      // get获取文件数据，阻止html直接显示
      // let request = new RequestMsg();
      // request.res = URLConfigs["exportStream"];
      // request.res += res.content;
      // request.isDefRespProcess = false;
      // this.httpService.get(request).then((res) => {
      //   // 字符内容转变成blob地址
      //   var blob = new Blob([res]);
      //   if (window.navigator.msSaveOrOpenBlob) {
      //     window.navigator.msSaveOrOpenBlob(blob, fileName);
      //   } else {
      //     var eleLink = document.createElement('a');
      //     eleLink.download = fileName;
      //     eleLink.style.display = 'none';
      //     eleLink.href = URL.createObjectURL(blob);
      //     // 触发点击
      //     document.body.appendChild(eleLink);
      //     eleLink.click();
      //     // 然后移除
      //     document.body.removeChild(eleLink);
      //   }
      // })
    });
  }

  /**
   * 对象列表查询
   */
  queryObjects(callback) {
    let _root = new NzTreeNode({ title: "", key: "" });
    let request = new RequestMsg();
    request.res = URLConfigs["objects"];
    // request.isDefRespProcess = false;
    this.httpService.post(request).then((res) => {
      if (res.content != null) {
        _root = this.getFormattedTree(_root, res.content);
        callback(_root);
      }
    });
  }

  /**
   * 对象树遍历解构
   */
  getFormattedTree(target: NzTreeNode, data: any) {
    let result;
    if (target != null) {
      result = target;
    } else {
      result = new NzTreeNode({ title: "", key: "" });
    }
    if (data != null) {
      result.title = data.name;
      result.key = data.id;
      let childNodes = data.children;
      if (null != childNodes) {
        for (var i = 0; i < childNodes.length; i++) {
          if (childNodes[i].type == 'NE') {
            let neNode = new NzTreeNode({ title: "", key: "" });
            neNode.key = childNodes[i].id;
            neNode.title = childNodes[i].name;
            neNode.isLeaf = true;
            result.children.push(neNode)
          } else if (childNodes[i].type == 'DOMAIN') {
            let logicNode = new NzTreeNode({ title: "", key: "" });
            logicNode.key = childNodes[i].id;
            logicNode.title = childNodes[i].name;
            logicNode.isLeaf = false;
            result.children.push(logicNode);
            this.getFormattedTree(logicNode, childNodes[i]);
          }
        }
      }
    }
    return result;
  }

  /**
   * 全网分布数据
   */
  queryDistributions(callback) {
    let request = new RequestMsg();
    request.res = URLConfigs['distributions'];
    // request.isDefRespProcess = false;
    this.httpService.post(request).then(callback);

  }

  /**
   * 模拟数据测试
   */
  getFakeResult() {
    let res = this.fakeRes;
    let result = { data: [], total: 0 };
    // result.total = res.total;
    result.total = 3;
    // let result = [];
    let objects = res.objects;
    for (let oIndex = 0; oIndex < result.total; oIndex++) {
      let row = objects[oIndex].object.row;
      // row = Object.assign({}, row)
      // row["ID"] = oIndex;
      result.data.push(row);
      row = null;
    }
    return result;
  }

  /**
   * 排行榜排序处理
   * @param data 原始数组
   * @param number 排行榜长度
   */
  orderTopN(data: any[], number?: number) {
    let result = data.sort((a, b) => {
      return b.value - a.value;
    });
    let num = number - 1;
    if (number != undefined) {
      let others = result.slice(num);
      result = result.slice(0, num);
      others = others.reduce((item, currentItem) => {
        item.value = item.value + currentItem.value;
        return item;
      }, { value: 0, name: this.getI18n("unm.report.distributions.others"), color: "#ededed" });
      result.push(others);
    }
    return result;
  }

  /**
   * 静态类型数据
   */
  queryTypes(type: string, callback) {
    let request = new RequestMsg();
    request.res = URLConfigs[type];
    // request.isDefRespProcess = false;
    this.httpService.post(request).then((res) => {
      callback(res.content);
    });

  }
}
