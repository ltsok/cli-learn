import { Component, Input, Renderer2, Inject, AfterViewInit, ComponentFactoryResolver, ViewChildren, QueryList, ViewContainerRef } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from '@waf_service/context';
import { WafDragDropItemModel } from './model/waf-dragdrop.model'

@Component({
  selector: 'waf-dragdrop',
  templateUrl: './waf-dragdrop.component.html',
  styleUrls: ['./waf-dragdrop.component.scss']
})
export class WafDragdropComponent implements AfterViewInit {
  @ViewChildren('eachDiv', { read: ViewContainerRef }) allDivRefs: QueryList<ViewContainerRef>;
  items;
  @Input()
  set dragdropItems(items: WafDragDropItemModel[]) {
    this.items = items;
  }
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
    //传入item size转换
    this.items.forEach(element => {
      if (element.size == "large") {
        element.size = 24;
      } else {
        element.size = 12;
      }
    });
    this.items.sort((item1, item2) => {
      if (item1.rowNum == item2.rowNum) {
        return Number.parseInt(item1.colNum) - Number.parseInt(item2.colNum);
      } else {
        return Number.parseInt(item1.rowNum) - Number.parseInt(item2.rowNum);
      }

    });
    console.log(this.items);
  }
  /**
   * 组件渲染完
   * @memberof DefaultComponent
   */
  ngAfterViewInit(): void {
    this.renderLayout();
  }

  renderLayout() {
    this.items.forEach((item: WafDragDropItemModel) => {
      let com = this.compResolver.resolveComponentFactory(item.component);
      let ref = this.getViewContainerRef(item.id);
      if (ref) {
        ref.createComponent(com);
        let clientWidth = Number.parseInt(ref.element.nativeElement.clientWidth);
        let height = this.calClientHeight(clientWidth, item.custom_width2Height);
        this.renderer.setStyle(ref.element.nativeElement.parentNode, 'height', height + 'px');

      } else {
        console.log("render item failed,item:" + item);
      }

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





