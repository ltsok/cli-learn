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
import { portConfig, colors } from "../../model/unm-report.model";
import { UnmReportHttpService } from "../../service/unm-report-http.service";
import { WafEchartComponent } from '@waf_component/echarts';

/**
 * report-port
 * @export
 * @class ReportPortComponent
 */
@Component({
  templateUrl: './report-port.component.html',
  styleUrls: ['./report-port.component.scss'],
  providers: [UnmReportHttpService]
})
export class ReportPortComponent implements OnInit {
  // 查询类型
  TYPE = "port";

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
  // 端口类型多选
  selectTypeList = [];
  // 更多条件,侧边栏显示状态
  visible = false;

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
      // TODO 端口类型，改为输入框
      portType: [''],
      portName: ['', [], []],
      portRate: [''],
      portLabel: [''],
      // 手动翻译。使用中，空闲。
      usage: [[{ label: this.reportHttpService.getI18n("unm.report.port.inUse"), value: '1' }, { label: this.reportHttpService.getI18n("unm.report.port.idle"), value: '0' }], [], []]
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
    let arr = []
    for (let i = 0; i < obj["usage"].length; i++) {
      const element = obj["usage"][i];
      if (element.checked === true) {
        arr.push(element.value);
      }
    }
    obj["usage"] = arr;
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
    this.chartData = "default";
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

    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    }
    this.selectTypeList = children;
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
