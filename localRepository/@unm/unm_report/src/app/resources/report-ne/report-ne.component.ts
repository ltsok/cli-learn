import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
import { GridComponent, GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy, process, State } from '@progress/kendo-data-query';

import { constant } from '../../unm-report.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

import { products, nodes } from '../../model/products';
import { NEConfig, colors } from "../../model/unm-report.model";
import { UnmReportHttpService } from "../../service/unm-report-http.service";
import { WafEchartComponent } from '@waf_component/echarts';

/**
 * report-ne
 * @export
 * @class ReportNeComponent
 */
@Component({
  templateUrl: './report-ne.component.html',
  styleUrls: ['./report-ne.component.scss'],
  providers: [UnmReportHttpService]
})
export class ReportNeComponent implements OnInit {
  // 查询类型
  TYPE = "ne";

  // 查询条件controlGroup
  mainForm: FormGroup;

  // 统计维度
  chartData = "default";

  // collapse配置
  panel = {
    active: false,
    disabled: false,
    customStyle: {
      'border': '0px'
    }
  };

  // 表格数据
  data: GridDataResult;
  total;

  // 查询条件
  isQuerying = false;
  //树选择
  public objectsList: any[];
  // 类型多选
  selectTypeList = [];
  // 更多条件,侧边栏显示状态
  visible = false;
  // 版本多选
  // selectVersionList = [];

  /**
   * 
   * @param logger 
   * @param context 
   * @param push 
   * @param http 
   * @param fb 
   * @memberOf UnmReportModule
   */
  constructor(private logger: LoggerService, private context: ContextService, private fb: FormBuilder, private reportHttpService: UnmReportHttpService) {
    if (this.context.getRouterParam() != undefined) {
      this.chartData = this.context.getRouterParam();
    }
    // 初始化查询表单
    this.mainForm = this.fb.group({
      // 对象范围
      objectId: [[], [], []],
      // 选择类型
      selectType: [[]],
      neId: [''],
      dateRange: [[]],
      IP0: [''],
      IP1: [''],
      // 选择版本
      // TODO 网元版本，U2000无此属性
      // selectVersion: [[]],
      neSN: [''],
      userLabel: [''],
      manStatus: [[{ label: this.reportHttpService.getI18n("unm.report.conditions.normal"), value: '1' }, { label: this.reportHttpService.getI18n("unm.report.conditions.engineering"), value: '0' }], [], []]
    });

  }

  ngOnInit(): void {
    this.loadOptions();
    this.initQuery();
    this.initStatistics();
  }

  /**
   * 手动处理checkbox值
   */
  formatFormValues() {
    let obj = this.mainForm.value;
    // 维护状态
    let arr = [];
    for (let i = 0; i < obj["manStatus"].length; i++) {
      const element = obj["manStatus"][i];
      if (element.checked === true) {
        arr.push(element.value);
      }
    }
    obj["manStatus"] = arr;
    // IP范围
    let arr1 = [];
    arr1.push(obj["IP0"]);
    arr1.push(obj["IP1"]);
    obj["neIp"] = arr1;
    // 网元类型
    let arr0 = [];
    for (let j = 0; j < obj["selectType"].length; j++) {
      const element = obj["selectType"][j];
      arr0.push(element.value);
    }
    obj["selectType"] = arr0;
    // 日期范围
    let arr2 = [];
    for (let j = 0; j < obj["dateRange"].length; j++) {
      const dateObj = obj["dateRange"][j];
      arr2.push(this.reportHttpService.transformDate(dateObj, "yyyy-MM-dd HH:mm:ss"));
    }
    obj["dateRange"] = arr2;
    return obj;
  }

  /**
   * 发起查询
   */
  initQuery() {
    // setTimeout(() => {
    //   this.isQuerying = false;
    //   this.data = this.reportHttpService.getFakeResult();
    //   this.total = this.data.total;
    // }, 7000);
    this.isQuerying = true;
    this.reportHttpService.openQuery(this.TYPE, this.formatFormValues(), (res) => {
      // res ws推送数据
      this.isQuerying = false;
      this.data = this.reportHttpService.getFormatedResult(res.body);
      this.total = this.data.total;
    });
  }

  /**
   * 发起统计
   */
  initStatistics() {
    // this.chartData = "default";
    // this.reportHttpService.openStatistics(this.TYPE, this.statisticFields, (res) => {
    //   //   // res ws推送数据
    //   this.chartData = this.reportHttpService.getFormatedResult(res.body);
    // });
  }

  /**
   * 选择对象范围
   */
  onObjectsChange($event: NzTreeNode): void {
  }

  /**
   * 初始化控件绑定
   */
  private loadOptions() {
    // 网元选择树数据
    this.reportHttpService.queryObjects((res) => {
      this.objectsList = res.children;
    })

    // 网元类型下拉框
    this.reportHttpService.queryTypes("boardTypes", (res) => {
      const children = [];
      res.forEach(element => {
        children.push({ "label": element.name, "value": element.key })
      });
      this.selectTypeList = children;
    });
  }

  /**
   * 更多查询条件显隐
   */
  open(): void {
    this.visible = true;
  }
  close(): void {
    this.visible = false;
  }

  /**
   * 导出
   */
  doExport(fileType: string) {
    this.reportHttpService.exportData(this.TYPE, fileType, (res) => {

    })
  }

  /**
   * 切换页码、切换页大小响应
   */
  onPagerChange(obj) {

    this.reportHttpService.queryPage(this.TYPE, obj.pageIndex, obj.pageSize, (res) => {
      this.data = this.reportHttpService.getFormatedPage(res);
    })
  }
}
