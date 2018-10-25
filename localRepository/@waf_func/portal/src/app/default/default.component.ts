import { Component, Inject, AfterViewInit, ComponentFactoryResolver, ViewChildren, QueryList, ViewContainerRef } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from '@waf_service/context';
import { IDataBoard } from '../interface/data-board.interface';
import { IQuickEntry } from '../interface/quick-entry.interface';
import { constant } from '../portal.constant';
import { WafLayoutItemModel } from '@waf_component/waf_layout';
import { DefaultDataBoardItem, DataBoardItem } from '../interface/data-board.model';

/**
 * 默认首页
 * @export
 * @class DefaultComponent
 */
@Component({
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements AfterViewInit {

  /**
   * 构造函数
   * @param {IDashboard[]} dashboardServices
   * @param {LoggerService} logger
   * @param {ComponentFactoryResolver} compResolver
   * @param {ContextService} context
   * @memberof DefaultComponent
   */
  constructor( @Inject('func.databoard') private dataBoardServices: IDataBoard[],
    @Inject('func.quickentry') private quickEntryServices: IQuickEntry[],
    private logger: LoggerService, private context: ContextService) {
    this.initItems();
  }

  quickEntryItems = [];
  dataBoardItems = [];

  initItems() {

    // 获取所有快捷入口
    this.quickEntryServices.forEach(quickEntryService => {
      this.quickEntryItems = this.quickEntryItems.concat(quickEntryService.getQuickEntryItems());
    })

    let originalDataBoardItems = [];//原始的数据面板所有数据
    // 获取数据模板的所有数据源
    this.dataBoardServices.forEach(dataBoardService => {
      originalDataBoardItems = originalDataBoardItems.concat(dataBoardService.getDataBoardItems());
    });
    //转换数据模型DataBoardItem=>DefaultDataBoardItem
    originalDataBoardItems.forEach((item: DataBoardItem) => {
      let temp = new DefaultDataBoardItem();
      temp.id = item.default_position;
      temp.width2Height = item.width2Height;
      temp.component = item.component;
      let row2col = item.default_position.split("-");
      temp.rowNum = row2col[0];
      temp.colNum = row2col[1];
      this.dataBoardItems.push(temp);
    });
  }

  /**
   * 组件渲染完
   * @memberof DefaultComponent
   */
  ngAfterViewInit(): void {


  }

}
