import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
import { GridComponent, GridDataResult, PageChangeEvent, DataStateChangeEvent, SelectableSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy, filterBy, CompositeFilterDescriptor, process, State } from '@progress/kendo-data-query';

import { constant } from '../../unm-report.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

import { products, nodes } from '../../model/products';
import { colors, boardConfig, slotConfig, shelfConfig, portConfig, oModuleConfig, NEConfig } from "../../model/unm-report.model";
import { UnmReportHttpService } from "../../service/unm-report-http.service";

/**
 * report-table
 * @export
 * @class ReportTableComponent
 */
@Component({
  selector: 'report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss']
})
export class ReportTableComponent {
  // 报表类型
  @Input() type;
  // 导出
  // @Output() onExport = new EventEmitter<string>();
  // 换页
  @Output() onPageIndexChanged = new EventEmitter<any>();
  // 类型配置
  config;
  // 显示类型名
  typeLabel;
  // 更新时间
  updateTime = new Date;

  // grid组件属性控制
  multiple = true;//允许多列排序
  allowUnsort = true;//允许无排序状态
  isfilterable = false;//过滤行显示状态
  // grid状态
  isGridLoading = true;//loading状态
  skip = 0;//跳过显示数据条数，第一条数据脚标
  take = 50;//pageSize
  //排序状态
  sort: SortDescriptor[];
  // 过滤器状态
  filter: CompositeFilterDescriptor;

  /**
   * 表格分页的说明：
   * 问题：pageSize变大的时候，grid滚动和换页明显指数级变卡。
   * 为了避免这个问题，使用kendoGrid自带的虚拟滚动加载DOM（限制DOM个数），再配合ZORRO的分页器进行展示。
   * 1. kendo内部分页和换页（state中的skip和take）只对垂直滚动的生效
   * 2. kendo的“全部数据”最多不超过zorro的pagesize
   * 3. zorro分页器的pagesize和pageindex与后台服务一致
   */
  @Input() total;//总数
  pageIndex = 1;
  pageSize = 50;
  pageSizeOptions = [50, 200, 500, 800]

  // 原始数据，排序、筛选用`
  @Input() data: GridDataResult;
  _data: GridDataResult = { data: [], total: 0 };
  // grid显示数据，total已变更
  gridView: GridDataResult;
  view = new Array(this.take).fill({}).map(x => ({}));

  // 全部列
  allCols = [];
  // 列配置显示状态
  isColsConfigVisible = false;
  // 列配置穿梭框
  transferList;
  tempTransferList;

  // 导出显示状态
  isExportVisible = false;
  isExporting = false;
  // 表格选择属性配置
  selectableSettings: SelectableSettings;
  selectable = true;//是否显示行选择列
  selectBy = "0";//第一列的“序号”作为行id
  mySelection: number[] = [];//选中行
  selectAllState: SelectAllCheckboxState = 'unchecked';//全选状态

  /**
   * 本表格组件数据由外部传入，不会发送查询请求，只会发导出请求
   * @param logger 
   * @param context 
   * @param http 
   * @memberOf UnmReportModule
   */
  constructor(private logger: LoggerService, private context: ContextService, private reportHttpService: UnmReportHttpService) {
    this.setSelectableSettings();
  }

  ngOnInit(): void {
    // 初始化类型配置数据
    let str = "";
    switch (this.type) {
      case 'board':
        this.config = boardConfig;
        this.context.getI18n("unm.report.type.board").subscribe((value) => { str = value; });
        break;
      case 'ne':
        this.config = NEConfig;
        this.context.getI18n("unm.report.type.ne").subscribe((value) => { str = value; });
        break;
      case 'omodule':
        this.config = oModuleConfig;
        this.context.getI18n("unm.report.type.omodule").subscribe((value) => { str = value; });
        break;
      case 'port':
        this.config = portConfig;
        this.context.getI18n("unm.report.type.port").subscribe((value) => { str = value; });
        break;
      case 'shelf':
        this.config = shelfConfig;
        this.context.getI18n("unm.report.type.shelf").subscribe((value) => { str = value; });
        break;
      case 'slot':
        this.config = slotConfig;
        this.context.getI18n("unm.report.type.slot").subscribe((value) => { str = value; });
        break;
      case 'custom':
        // TODO 
        // this.config = slotConfig;
        // this.context.getI18n("unm.report.type.slot").subscribe((value) => { str = value; });
        break;
      default:
        break;
    }
    this.typeLabel = str;
    this.loadOptions();
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes): void {
    // 获取data值之后初始化默认查询数据
    if (changes["data"].currentValue != null) {
      // this.total = this.data.total;
      this.updateTime = new Date;
      // 裁剪掉超出当前页大小的数据
      if (this.data.data.length > this.pageSize) {
        this.data.data = this.data.data.slice(0, this.pageSize);
      }
      this._data.data = this.data.data;
      this.showGrid(this.data);
      this.isGridLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.resetGridState();
  }

  /**
   * 重置grid状态
   */
  resetGridState() {
    //跳过显示数据条数，第一条数据脚标
    this.skip = 0;
    //排序状态
    this.sort = [];
    // 过滤器状态
    this.filter = {
      logic: 'and',
      filters: []
    }
  }
  /**
   * 初始化控件绑定
   */
  private loadOptions() {
    // 列配置
    this.allCols = this.config.colConfigs;
    const _list = [];
    for (let i = 0; i < this.allCols.length; i++) {
      const element = this.allCols[i];
      if (!element.hidden) {
        _list.push({
          key: i,
          title: element.name,
          direction: "left"
        })
      } else {
        _list.push({
          key: i,
          title: element.name,
          direction: "right"
        })
      }
    }
    this.transferList = _list;
    this.tempTransferList = _list;
  }

  /**
   * 行选中响应
   * @param e 
   */
  onSelectedKeysChange(e) {
    const len = this.mySelection.length;

    if (len === 0) {
      this.selectAllState = 'unchecked';
    } else if (len > 0 && len < this.data.data.length) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = 'checked';
    }
  }

  /**
   * 全选响应
   * @param checkedState 全选状态
   */
  onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === 'checked') {
      this.mySelection = this.data.data.map((item) => item[this.selectBy]);
      this.selectAllState = 'checked';
    } else {
      this.mySelection = [];
      this.selectAllState = 'unchecked';
    }
  }

  /**
   * 设置选择项配置
   */
  setSelectableSettings(): void {
    this.selectableSettings = { enabled: this.selectable, checkboxOnly: false, mode: "multiple" };
  }

  /**
   * 导出
   */
  // TODO 选中导出的界面需要等UCD设计调整
  doExport(fileType: string) {
    this.isExportVisible = false;
    this.isExporting = true;
    // this.onExport.emit(fileType);
    this.reportHttpService.exportData(this.type, fileType, (res) => {
      this.isExporting = false;
    }, this.mySelection)
  }

  /**
   * 显示列配置穿梭框
   */
  showColTransfer() {
    this.isColsConfigVisible = true;
  }

  /**
   * 存储临时穿梭元素列表
   * @param event 穿梭的元素数组
   */
  transferChange(event) {
    if (event.from === "left" && event.to === "right") {
      for (let i = 0; i < event.list.length; i++) {
        const element = event.list[i];
        this.tempTransferList[element.key].direction = "right";
      }
    } else {
      for (let i = 0; i < event.list.length; i++) {
        const element = event.list[i];
        this.tempTransferList[element.key].direction = "left";
      }
    }
  }

  /**
   * 应用调整的穿梭元素列表
   */
  transferOK() {
    this.isColsConfigVisible = false;
    this.transferList = this.tempTransferList;

    for (let i = 0; i < this.transferList.length; i++) {
      const element = this.transferList[i];
      if (element.direction === "left") {
        this.allCols[i].hidden = false;
      } else {
        this.allCols[i].hidden = true;
      }
    }
  }

  /**
   * 放弃调整的穿梭元素列表
   */
  transferCancel() {
    this.isColsConfigVisible = false;
    this.tempTransferList = this.transferList;
  }

  /**
   * 过滤响应
   * @param 过滤状态
   */
  filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    // 过滤会造成数据减少，一定要用原始数据过滤
    this._data.data = filterBy(this.data.data, filter);
    this.showGrid(this._data);
  }

  /**
   * 过滤响应
   * @param 过滤状态
   */
  sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    // 直接使用当前数据（可能已包含过滤状态）排序
    this._data.data = orderBy(this._data.data, sort);
    this.showGrid(this._data);
  }

  /**
   * grid滚动响应
   * @param event 滚动变化数据
   */
  innerPageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.showGrid(this._data);
  }

  /**
   * grid显示数据
   * @param {opration} 操作方式
   */
  showGrid(_data) {

    const currentView = _data.data.slice(this.skip, this.skip + this.take);

    if (currentView.length === 0) {
      this.view = [];
      this.gridView = {
        data: this.view,
        total: _data.data.length
      };
    } else {
      const removeCount = this.view.length - currentView.length;
      if (removeCount > 0) {
        this.view.splice(currentView.length - 1, removeCount);
      }
      currentView.forEach((item, index) => {
        if (!this.view[index]) {
          this.view[index] = {};
        }
        Object.assign(this.view[index], item);
      });
      this.gridView = {
        data: this.view,
        total: _data.data.length
      };
    }
  }

  cellClick(event) {
  }

  /**
   * 切换页码、切换页大小事件冒泡
   */
  onPagerChange() {
    // 重置grid状态
    this.resetGridState();
    this.onPageIndexChanged.emit({ 'pageIndex': this.pageIndex, 'pageSize': this.pageSize });
  }
}
