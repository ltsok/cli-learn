import { Injectable } from "@angular/core";
import { DatePipe } from '@angular/common';

import { NzTreeNode } from 'ng-zorro-antd';

import { PushService } from "@waf_service/push";
import { HttpService, RequestMsg } from "@waf_service/http";
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
 * unm_pm服务
 * @export
 * @class UnmPmService
 */
@Injectable()
export class UnmPmService {
  // 查询ID
  queryId: string;
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
   * @param date 日期对象，或日期数组
   * @param format 目标格式
   */
  transformDate(date: any, format) {

    if (Object.prototype.toString.call(date) === '[object Array]') {
      let arr = [];
      date.forEach(ele => {
        arr.push(this.datePipe.transform(ele, format))
      });
      return arr;
    } else {
      return this.datePipe.transform(date, format)
    }
  }

  /**
   * 静态类型数据
   */
  queryTypes(type: string, callback) {
    let request = new RequestMsg();
    // request.res = URLConfigs[type];
    // request.isDefRespProcess = false;
    this.httpService.post(request).then((res) => {
      callback(res.content);
    });

  }

  /**
   * 性能查询数据导出
   *
   * @param {*} TYPE 当前性能还是历史性能
   * @param {*} fileType 导出文件类型
   * @param {*} callback 回调
   * @param {any[]} [rows] 选中导出
   * @memberof UnmPmService
   */
  exportData(TYPE, fileType, callback, rows?: any[]) {
    let request = new RequestMsg();
    request.res = URLConfigs["export"];
    let _conditions = {
      "type": "",
      "queryId": "",
      "reportId": 5
    };
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
}
