import { Component } from '@angular/core';
import { constant } from '../unm-report.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
import { GridComponent, GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy, process, State } from '@progress/kendo-data-query';

import { colCategories } from "../model/unm-report.model";
import { UnmReportHttpService } from "../service/unm-report-http.service";

// 查询类型
const TYPE = "custom";
/**
 * report-custom
 * @export
 * @class ReportCustomComponent
 */
@Component({
  templateUrl: './report-custom.component.html',
  styleUrls: ['./report-custom.component.scss'],
  providers: [UnmReportHttpService]
})
export class ReportCustomComponent {
  // 列表数据
  list = [
    {
      id: 0,
      title: 'Title 1',
      isHovered: false,
      isSelected: false,
    },
    {
      id: 1,
      title: 'Title 2',
      isHovered: false,
      isSelected: false,
    },
    {
      id: 2,
      title: 'Title 3',
      isHovered: false,
      isSelected: false,
    },
    {
      id: 3,
      title: 'Title 4',
      isHovered: false,
      isSelected: false,
    }
  ];

  /*************************************************************************************************************************
   * 查询展示变量
   */
  isQuerying = false;
  //树选择
  objectId = [];
  public objectsList: any[];
  // 更新时间
  updateTime;
  total = 0;//总数
  // 全部数据
  data;

  /*************************************************************************************************************************
   * 编辑模式变量
   */
  // 显示编辑模式
  isEditable = true;
  // 名称
  reportName;
  // 对象范围
  objects;
  // 可选列
  colCategories = colCategories;
  // 选中列
  selectedCols;
  // 缓存选中列，恢复全选中间态
  tempSelectedCols = [];

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {ContextService} context
   * @param push 
   * @param http 
   * @param fb 
   * @memberof UnmReportModule
   */
  /**
   * 
   */
  constructor(private logger: LoggerService, private context: ContextService, private reportHttpService: UnmReportHttpService) { }

  ngOnInit(): void {
    // this.loadOptions();
    this.updateTime = new Date;
  }

  /**
   * 点击左侧列表
   * @param obj 列表元素
   */
  reportClick(obj) {
    this.list = this.list.map((item, index) => {
      if (item.id === obj.id) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
      return item;
    })
  }

  /*************************************************************************************************************************
   * 查询展示逻辑
   */
  /**
   * 初始化控件绑定
   */
  private loadOptions() {
    // 网元选择树数据
    this.reportHttpService.queryObjects((res) => {
      this.objectsList = res.children;
    })
  }

  /**
   * 发起查询
   */
  initQuery() {
    // this.data = this.reportHttpService.getFakeResult();
    // this.total = this.data.total;
    // this.updateTime = new Date;
    // this.showGrid();
    this.isQuerying = true;
    this.reportHttpService.openQuery(TYPE, this.objectId, (res) => {
      //   // res ws推送数据
      this.isQuerying = false;
      this.data = this.reportHttpService.getFormatedResult(res.body);
      this.total = this.data.total;
    });
  }


  /*************************************************************************************************************************
   * 编辑模式逻辑
   */

  /**
   * 增加自定义报表
   */
  addReport() {
    this.isEditable = !this.isEditable;
  }

  /**
   * 类别全选切换
   * @param name 类别名
   */
  categoryChange(boolean, name) {
    for (let index = 0; index < this.colCategories.length; index++) {
      const element = this.colCategories[index];
      if (element.name === name) {
        this.colCategories[index].indeterminate = false;
        this.colCategories[index].colsOptions = element.colsOptions.map((item) => {
          item.checked = boolean;
          return item;
        });
        break;
      }
    }
  }

  /**
   * 列单项切换
   * @param $event 选中值
   * @param index 操作的类别序号
   */
  colChange($event, index) {

  }
}
