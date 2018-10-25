import {Inject, Component, Input, Output, EventEmitter, OnInit, ContentChildren, QueryList} from '@angular/core';
import { Observable, Observer } from 'rxjs';
import {constant} from './waf-datatable.constant';

import {NzFormatEmitEvent, NzTreeNode, NzModalService, NzMessageService} from 'ng-zorro-antd';
import { GridComponent, GridDataResult, PageChangeEvent, DataStateChangeEvent, SelectableSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy, filterBy, CompositeFilterDescriptor, process, State } from '@progress/kendo-data-query';
import {ContextService} from "@waf_service/context";
import { LoggerService } from '@waf_service/logger';
import * as $ from "jquery";

/**
 * 封装datatable组件
 * @export
 * @class WafDataTableComponent
 */
@Component({
  templateUrl: './waf-datatable.component.html'
  , styleUrls: ['./waf-datatable.component.scss']
  , 'selector': 'waf-datatable'
})
export class WafDataTableComponent implements OnInit {
  // @Output() onRefresh: EventEmitter<any> = new EventEmitter<any>();
  me;
  addable:boolean = false;
  exportable:boolean = false;
  colConfigable:boolean = false;
  filterable:boolean = false;
  batchOperable:boolean = false;

  @Output() init = new EventEmitter<any>();
  // 导出
  @Output() onExport = new EventEmitter<string>();
  // 新建
  @Output() onAdd = new EventEmitter<any>();
  // 用户自定义命令
  @Output() onUserDefCmd = new EventEmitter<any>();
  // 换页
  @Output() onPageIndexChanged = new EventEmitter<any>();
  // 操作
  @Output() onCommandClicked = new EventEmitter<any>();
  isBatchOper:boolean = false;
  // grid组件属性控制
  multiple = true;//允许多列排序
  allowUnsort = true;//允许无排序状态
  isfilterable = false;//过滤行显示状态
  // grid状态
  isGridLoading = false;//loading状态
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
  total:number;//总数
  pageIndex:number = 1;
  pageSize:number = 50;
  pageSizeOptions = [50, 100, 200, 800]

  // 原始数据，排序、筛选用`
  data: GridDataResult;
  _data: GridDataResult = { data: [], total: 0 };
  // grid显示数据，total已变更
  gridView: GridDataResult;
  view = new Array(this.take).fill({}).map(x => ({}));

  // 全部列
  allCols = [];
  // 列配置显示状态
  isColsConfigVisible = false;
  // 列配置穿梭框
  transferList = [];
  tempTransferList = [];

  // 导出显示状态
  isExportVisible = false;
  isExporting = false;

  // 表格选择属性配置
  selectableSettings: SelectableSettings;
  selectable = false;//是否显示行选择列

  commandColIndex:number = -1;

  selectBy = "0";//第一列的“序号”作为行id
  mySelection: number[] = [];//选中行
  selectAllState: SelectAllCheckboxState = 'unchecked';//全选状态

  selectedRows:any;
  userCmds:any;
  currentRow:any;

  _width = '100%';
  _height = '100%';

  /**
   * 本表格组件数据由外部传入，不会发送查询请求，只会发导出请求
   * @param logger
   * @param context
   * @param http
   * @memberOf UnmReportModule
   */
  constructor(private logger: LoggerService, private context: ContextService, private modalService: NzModalService, private message: NzMessageService) {
    this.setSelectableSettings();
  }

  @Input()
  set id(flag: string) {
    this.me = flag;
    this.init.emit(this);
  }

  setHeight(height:number) {
    var paginationHeight = document.getElementById('datatablepagination').offsetHeight;
    // console.log('datatable real height = ', paginationHeight);
    this._height = (height - paginationHeight - (30 +10)) + 'px';
  }

  @Input()
  set style(flag: string) {
    if (null != flag) {
      var style = eval(flag);
      if (null != style.width) {
        this._width = style.width;
      }
      if (null != style.height) {
        this._height = style.height;
      }
    }
  }

  getId() {
    return this.me;
  }

  @Input()
  set hasAdd(flag: boolean) {
    this.addable = flag;
  }

  @Input()
  set hasExport(flag: boolean) {
    this.exportable = flag;
  }

  @Input()
  set hasColConfig(flag: boolean) {
    this.colConfigable = flag;
  }

  @Input()
  set hasFilter(flag: boolean) {
    this.filterable = flag;
  }

  @Input()
  set hasBatchOper(flag: boolean) {
    this.batchOperable = flag;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  onUserDefCmdClick($event) {
    var cmdTotal = this.userCmds.length;
    let totalPage:number = this.total % this.pageSize == 0 ? parseInt(''+this.total / this.pageSize) : parseInt(''+this.total / this.pageSize) + 1;
    let isLastPage = false;
    if (this.pageIndex == totalPage && this.selectedRows.length < this.data.data.length) {
      isLastPage = true;
    }
    this.onUserDefCmd.emit({index:cmdTotal - 1 - $event, selectedRows:this.selectedRows, isLastPage:isLastPage});
  }

  onAddClicked($event) {
    this.onAdd.emit($event);
  }

  setUserCmds(userCmds:any) {
    if (null != userCmds) {
      this.userCmds = userCmds;
      this.userCmds.reverse();
    }
  }

  setCols(cols:any) {
    this.allCols = cols;
    if (null != this.allCols) {
      this.allCols.unshift({"name": "序号", "hidden": false, "width": "60"});
      for (var i = 0; i < this.allCols.length; i++) {
        if (this.allCols[i]['command'] == true) {
          this.commandColIndex = i;
        }
      }
    }
  }

  setDataSource(dataSource:any, renderType:number) {
    if (0 == renderType) {
      var newDatas = this.convertDataSource(dataSource.data, 0);
      this.data = {data:newDatas, total:dataSource.total};
      this.total = dataSource.total;
      this._data = {data:newDatas, total:dataSource.total};
      // 裁剪掉超出当前页大小的数据
      if (this.data.data.length > this.pageSize) {
        this.data.data = this.data.data.slice(0, this.pageSize);
      }
      this._data.data = this.data.data;
      this.isGridLoading = false;
    } else if (1 == renderType) {
      // 只有当前页位于最后一页的时候，才做追加
      let totalPage:number = this.total % this.pageSize == 0 ? parseInt(''+this.total / this.pageSize) : parseInt(''+this.total / this.pageSize) + 1;
      if (this.pageIndex == totalPage) {
        // 重置grid状态
        this.resetGridState();
        var newDatas = this.convertDataSource(dataSource.data, 1);
        this.data.data = this.data.data.concat(newDatas);
        this.data.total += newDatas.length;
        this.total = this.data.total;
        // 裁剪掉超出当前页大小的数据
        if (this.data.data.length > this.pageSize) {
          this.data.data = this.data.data.slice(0, this.pageSize);
        }
        this._data.data = this.data.data;
        // 重置选中状态
        this.onSelectedKeysChange(null);
      } else {
        this.data.total += dataSource.data.length;
        this.total = this.data.total;
      }
    }
    this.showGrid(this._data);
  }

  generateNewDatas(newDatas:any) {
    var oldDatas = this.data.data;

  }

  convertDataSource(data:any, type:number) {
    if (0 == type) {
      var preIndex = (this.pageIndex - 1) * this.pageSize;
      for (var i = 0; i < data.length; i++) {
        data[i].unshift(preIndex + i + 1);
      }
      if (-1 != this.commandColIndex && null != data) {
        for (var i = 0; i < data.length; i++) {
          data[i].splice(this.commandColIndex, 0, null);
        }
      }
    } else if (1 == type) {
      var preIndex = Number(this.data.data[this.data.data.length - 1][0]);
      for (var i = 0; i < data.length; i++) {
        data[i].unshift(preIndex + i + 1);
      }
      if (-1 != this.commandColIndex && null != data) {
        for (var i = 0; i < data.length; i++) {
          data[i].splice(this.commandColIndex, 0, null);
        }
      }
    }
    return data;
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
   * 设置选择项配置
   */
  setSelectableSettings(): void {
    this.selectableSettings = { enabled: this.selectable, checkboxOnly: true, mode: "multiple" };
  }

  /**
   * 全选响应
   * @param checkedState 全选状态
   */
  onSelectAllChange(checkedState: SelectAllCheckboxState) {
    // console.log('onSelectAllChange...');
    if (checkedState === 'checked') {
      this.mySelection = this.data.data.map((item) => item[this.selectBy]);
      this.selectAllState = 'checked';
    } else {
      this.mySelection = [];
      this.selectAllState = 'unchecked';
    }
    this.generateSelectedRows();
  }

  /**
   * 行选中响应
   * @param e
   */
  onSelectedKeysChange(e) {
    // console.log('onSelectedKeysChange...', this.mySelection);
    const len = this.mySelection.length;
    if (len === 0) {
      this.selectAllState = 'unchecked';
    } else if (len > 0 && len < this.data.data.length) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = 'checked';
    }
    this.generateSelectedRows();
  }

  onBatchClicked() {
    this.isBatchOper = !this.isBatchOper;
    this.selectable = !this.selectable;
    this.setSelectableSettings();
  }

  /**
   * 导出
   */
  // TODO 选中导出的界面需要等UCD设计调整
  doExport(fileType: string) {
    this.isExportVisible = false;
    this.isExporting = true;
    this.onExport.emit(fileType);
 /*   this.reportHttpService.exportData(this.type, fileType, (res) => {
      this.isExporting = false;
    }, this.mySelection)*/
  }

  doExportFinished() {
    this.isExporting = false;
  }

  doCopyFinished(item:any) {
    if (null != item) {
      this.setDataSource({data:[item]}, 1);
    }
  }

  doAddFinished(item:any) {
    if (null != item) {
      this.setDataSource({data:[item]}, 1);
    }
  }

  doDeleteFinished() {
    // 只有当前页位于最后一页的时候，才做删除
    let totalPage:number = this.total % this.pageSize == 0 ? parseInt(''+this.total / this.pageSize) : parseInt(''+this.total / this.pageSize) + 1;
    if (this.pageIndex == totalPage) {
      this.resetGridState();
      for (var i = 0; i < this.data.data.length; i++) {
        var exist = false;
        for (var j = 0; j < this.mySelection.length; j++) {
          if (this.data.data[i][0] == this.mySelection[j]) {
            exist = true;
            this.mySelection.splice(j, 1);
            break;
          }
        }
        if (true == exist) {
          this.data.data.splice(i--, 1);
          this.data.total--;
        }
      }
      // 序号重排
      var preIndex = (this.pageIndex - 1) * this.pageSize;
      for (var i = 0; i < this.data.data.length; i++) {
        this.data.data[i][0] = preIndex + i + 1;
      }
      this._data.data = this.data.data;
      this._data.total = this.data.total;
      this.total = this.data.total;
      this.skip = 0;
      this.showGrid(this._data);
      this.mySelection.length = 0;
      this.selectedRows = null;
      this.onSelectedKeysChange(null);
    }
  }

  /**
   * 显示列配置穿梭框
   */
  showColTransfer() {
    this.isColsConfigVisible = true;
    this.loadOptions();
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
    // 重置skip
    this.skip = 0;
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
    console.log('innerPageChange', event.skip);
    this.skip = event.skip;
    this.showGrid(this._data);
  }

  /**
   * grid显示数据
   * @param {opration} 操作方式
   */
  showGrid(_data) {
    console.log('showGrid, this.skip = ', this.skip);
    const currentView = _data.data.slice(this.skip, this.skip + this.take);
    if (null != currentView) {
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
  }

  /**
   * 切换页码、切换页大小事件冒泡
   */
  onPagerChange(index) {
    console.log('onPagerChange = ', index);
    this.resetCheckStatus();
    // 重置grid状态
    this.resetGridState();
    this.onPageIndexChanged.emit({ 'pageIndex': this.pageIndex, 'pageSize': this.pageSize });
  }

  commandClicked(commandItem:any) {
    this.currentRow = commandItem.dateItem;
    this.onCommandClicked.emit(commandItem);
  }

  resetCheckStatus() {
    this.mySelection.length = 0;
    this.selectedRows = null;
    this.selectAllState = 'unchecked';
  }

  generateSelectedRows() {
    if (this.mySelection) {
      this.selectedRows = [];
      for (var i = 0; i < this.mySelection.length; i++) {
        var no = this.mySelection[i];
        for (var j = 0; j < this.data.data.length; j++) {
          if (this.data.data[j][0] == no) {
            this.selectedRows.push(this.data.data[j]);
            break;
          }
        }
      }
    }
    console.log('selectedRows = ', this.selectedRows);
  }

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
}
