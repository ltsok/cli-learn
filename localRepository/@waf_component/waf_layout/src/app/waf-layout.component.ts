import { Component, Input, Renderer2, Inject, AfterViewInit, ComponentFactoryResolver, ViewChildren, QueryList, ViewContainerRef } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from '@waf_service/context';
import { WafLayoutItemModel } from './model/waf-layout.model'

@Component({
  selector: 'waf-layout',
  templateUrl: './waf-layout.component.html',
  styleUrls: ['./waf-layout.component.scss']
})
export class WafLayoutComponent implements AfterViewInit {
  @ViewChildren('eachDiv', { read: ViewContainerRef }) allDivRefs: QueryList<ViewContainerRef>;
  items;
  @Input()
  set layoutItems(items: WafLayoutItemModel[]) {
    this.items = items;
  }

  layout = [];
  /**
   * 构造函数
   * @param {IDashboard[]} dashboardServices
   * @param {LoggerService} logger
   * @param {ComponentFactoryResolver} compResolver
   * @param {ContextService} context
   * @memberof DefaultComponent
   */
  constructor(
    private logger: LoggerService, private compResolver: ComponentFactoryResolver,
    private context: ContextService, private renderer: Renderer2) {

  }
  ngOnInit() {
    this.initItems();
  }

  initItems() {
    let itemsByRow: Map<number, Array<WafLayoutItemModel>> = new Map<number, Array<WafLayoutItemModel>>();
    this.items.forEach(item => {

      // 校验必选项
      if (!item.rowNum || !item.colNum || !item.width2Height || !item.component) {
        throw new Error('The rowNum/colNum/width2Height/component of layout-item must be specified.');
      }

      // 按照行分类
      if (itemsByRow.has(item.rowNum)) {
        itemsByRow.get(item.rowNum).push(item);
      } else {
        itemsByRow.set(item.rowNum, [item]);
      }

    });

    this.layout = [];
    itemsByRow.forEach((value: WafLayoutItemModel[], key: number) => {

      // 行内按照列序号升序排
      value.sort((a: WafLayoutItemModel, b: WafLayoutItemModel) => {
        return a.colNum - b.colNum;
      });

      // 获取单元格总数
      let itemTotal = value.length;

      // 分配每个单元格的宽度
      let cols = [];
      let unit = Math.floor(24 / itemTotal) < 0 ? 1 : Math.floor(24 / itemTotal);
      value.forEach((item) => {
        item.width = unit;
        item.id = item.rowNum + "_" + item.colNum;
        cols.push(item);
      });
      this.layout.push({ rowNum: key, cols: cols });
      // 行间按照行序号升序排
      this.layout.sort((a, b) => {
        return a.rowNum - b.rowNum;
      });
    })
  }
  /**
   * 组件渲染完
   * @memberof DefaultComponent
   */
  ngAfterViewInit(): void {
    this.renderLayout();
  }

  renderLayout() {
    this.layout.forEach((rowDatas) => {
      rowDatas.cols.forEach((item: WafLayoutItemModel) => {
        let com = this.compResolver.resolveComponentFactory(item.component);
        let ref = this.getViewContainerRef(item.id);
        if (ref) {
          ref.createComponent(com);
          let clientWidth = Number.parseInt(ref.element.nativeElement.clientWidth);
          let height = this.calClientHeight(clientWidth, item.width2Height);
          this.renderer.setStyle(ref.element.nativeElement.parentNode, 'height', height + 'px');
        } else {
          console.log("render item failed,item:" + item);
        }

      });
    });
  }

  calClientHeight(clientWidth: number, width2Height: string) {
    let height;
    if (width2Height) {
      let tempArray = width2Height.split(":");
      height = clientWidth / Number.parseInt(tempArray[0]) * Number.parseInt(tempArray[1]);

    } else {
      height = clientWidth;
    }
    return height;
  }


  private getViewContainerRef(id: string): ViewContainerRef {
    let retRef = null;
    let refList = this.allDivRefs.toArray();
    for (let i = 0; i < refList.length; i++) {
      let tempRef = refList[i];
      if (tempRef.element.nativeElement.id === id) {
        retRef = tempRef;
        break;
      }
    }
    return retRef;
  }
}


