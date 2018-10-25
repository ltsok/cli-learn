import { Component } from '@angular/core';
import { constant } from '../../unm-report.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { TpiService } from "@waf_service/tpi";
import { RouterService } from "@waf_service/router";

import { UnmReportMenuService } from "../../service/unm-report-menu.service";
import { UnmReportHttpService } from "../../service/unm-report-http.service";
import { WafEchartComponent } from '@waf_component/echarts';

import { disRes } from "../../model/mock-res";
/**
 * report-distribution
 * @export
 * @class ReportDistributionComponent
 */
@Component({
  templateUrl: './report-distribution.component.html',
  styleUrls: ['./report-distribution.component.scss'],
  providers: [UnmReportHttpService]
})
export class ReportDistributionComponent {
  fres = disRes;
  // 总计概览配置
  numSummary = [{
    type: "ne",
    label: 'unm.report.type.ne',
    icon: 'fh-wangyuan',
    color: "rgb(0,200,148)",
    value: '-',
  }, {
    type: "board",
    label: 'unm.report.type.board',
    icon: 'fh-danpan',
    color: "rgb(116,191,84)",
    value: '-',
  }, {
    type: "port",
    label: 'unm.report.type.port',
    icon: 'fh-duankou',
    color: "rgb(92,193,179)",
    value: '-',
  }, {
    type: "shelf",
    label: 'unm.report.type.shelf',
    icon: 'fh-jikuang',
    color: "rgb(93,168,250)",
    value: '-',
  }, {
    type: "slot",
    label: 'unm.report.type.slot',
    icon: 'fh-caowei',
    color: "rgb(120,116,242)",
    value: '-',
  }, {
    type: "omodule",
    label: 'unm.report.type.omodule',
    icon: 'fh-guangmokuai',
    color: "rgb(68,169,204)",
    value: '-',
  }];
  // 初始化统计数据
  statisticsData = {
    neList: null,
    portList: null,
    singlePlateList: null,
    slotList: null,
    boxList: null,
    opticalModuleList: null
  };
  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {ContextService} context
   * @memberof UnmReportModule
   */
  constructor(private logger: LoggerService, private context: ContextService, private reportHttpService: UnmReportHttpService, private tpiService: TpiService, private router: RouterService) { }

  ngOnInit(): void {
    this.fres = disRes;
    // 翻译词条
    for (let i = 0; i < this.numSummary.length; i++) {
      const element = this.numSummary[i];
      element.label = this.reportHttpService.getI18n(element.label);
    }
    this.initQuery();
  }

  initQuery() {
    // let res = this.fres;
    this.reportHttpService.queryDistributions((res) => {
      for (const key in res.content) {
        if (res.content.hasOwnProperty(key)) {
          const element = res.content[key];
          // 总量数字或者类别统计数据初始化
          if (Object.prototype.toString.call(element) === '[object Array]' && element != null) {
            this.statisticsData[key] = element;
          } else if (Object.prototype.toString.call(element) != '[object Array]' && element != null) {
            // 总计数字各自赋值
            switch (key) {
              case 'neNum':
                this.numSummary[0].value = element;
                break;
              case 'singlePlateNum':
                this.numSummary[1].value = element;
                break;
              case 'portNum':
                this.numSummary[2].value = element;
                break;
              case 'boxNum':
                this.numSummary[3].value = element;
                break;
              case 'slotNum':
                this.numSummary[4].value = element;
                break;
              case 'opticalModuleNum':
                this.numSummary[5].value = element;
                break;
            }
          }
        }
      }
    });

  }

  /**
   * 跳转到对应存量查询页面
   * @param type 类型标志
   */
  viewDetail(type) {
    let menuItem;
    switch (type) {
      case "ne":
        menuItem = this.tpiService.getMenuItem(20300000100)
        break;
      case "board":
        menuItem = this.tpiService.getMenuItem(20300000103);
        break;
      case "port":
        menuItem = this.tpiService.getMenuItem(20300000104);
        break;
      case "shelf":
        menuItem = this.tpiService.getMenuItem(20300000101);
        break;
      case "slot":
        menuItem = this.tpiService.getMenuItem(20300000102);
        break;
      case "omodule":
        menuItem = this.tpiService.getMenuItem(20300000105);
        break;
      default:
        break;
    }

    this.router.navigate(menuItem);
  }
}
