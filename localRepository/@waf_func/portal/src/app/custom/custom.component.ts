import { Component, Inject, AfterViewInit, ComponentFactoryResolver, ViewChildren, QueryList, ViewContainerRef } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from '@waf_service/context';
import { IDataBoard } from '../interface/data-board.interface';
import { IQuickEntry } from '../interface/quick-entry.interface';
import { constant } from '../portal.constant';
import { WafLayoutItemModel } from '@waf_component/waf_layout';
import { CustomDataBoardItem, DataBoardItem } from '../interface/data-board.model';
/**
 * 自定义首页
 * @export
 * @class CustomComponent
 */
@Component({
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.scss']
})
export class CustomComponent implements AfterViewInit {

  /**
   * 构造函数
   * @param {IDashboard[]} dashboardServices
   * @param {LoggerService} logger
   * @param {ComponentFactoryResolver} compResolver
   * @param {ContextService} context
   * @memberof CustomComponent
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
    })

    //转换数据模型DataBoardItem=>CustomDataBoardItem
    originalDataBoardItems.forEach((item: DataBoardItem) => {
      let temp = new CustomDataBoardItem();
      temp.id = item.custom_position;
      temp.size = item.size;
      temp.component = item.component;
      temp.custom_width2Height = item.custom_width2Height;
      let row2col = item.custom_position.split("-");
      temp.rowNum = row2col[0];
      temp.colNum = row2col[1];
      this.dataBoardItems.push(temp);
    })

  }

  /**
   * 组件渲染完
   * @memberof CustomComponent
   */
  ngAfterViewInit(): void {


  }

}
