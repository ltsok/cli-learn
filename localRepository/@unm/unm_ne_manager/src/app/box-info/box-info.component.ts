import { Component, Renderer2, Input, ViewChild, ElementRef } from '@angular/core';
import { constant } from '../unm-ne-manager.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { UnmNeManagerHttpService } from '../service/unm-ne-manager-http.service';
import { DishItem } from '../box-view/box-view.component';
import { ViewportScroller } from "@angular/common";
import { TpiService } from "@waf_service/tpi";
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
/**
 * box-info
 * @export
 * @class BoxInfoComponent
 */
@Component({
  selector: 'box-info',
  templateUrl: './box-info.component.html',
  styleUrls: ['./box-info.component.scss']
})
export class BoxInfoComponent {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {ContextService} context
   * @memberof UnmNeManagerModule
   */
  constructor(private logger: LoggerService, private context: ContextService, private ren: Renderer2, private httpService: UnmNeManagerHttpService, private tpi: TpiService) {
    this.ren.listen('document', 'click', (ev) => {
      this.isShowPorts = false;
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.httpService.subscribeAlarmStatus((res) => {
      if (!res.body) return;
      console.log('单盘告警灯');
      console.log(JSON.parse(res.body));
      let msgs = JSON.parse(res.body) as Array<any>;
      msgs.forEach((alarm: any) => {
        for (let i = 0; i < this.boxs.length; i++) {
          let items = this.boxs[i].dishs;
          for (let j = 0; j < items.length; j++) {
            let item: DishItem = items[j];
            if (item.dishId === alarm.boardId) {
              if (alarm.unconfirmLamp === 0) {
                item.lightColor = 'white'
              } else if (alarm.unconfirmLamp === 1) {
                item.lightColor = 'green'
              } else if (alarm.unconfirmLamp === 2) {
                item.lightColor = 'blue'
              } else if (alarm.unconfirmLamp === 3) {
                item.lightColor = 'yellow'
              } else if (alarm.unconfirmLamp === 4) {
                item.lightColor = 'orange'
              } else if (alarm.unconfirmLamp === 5) {
                item.lightColor = 'red'
              } else if (alarm.unconfirmLamp === 6) {
                item.lightColor = '#575859'
                item.isBreakLine = false;
              }
              break;
            }
          }
        }
      })
    });
  }
  boxs: any[];
  _neId: number;
  public products: DishPort[] = [];
  public sort: SortDescriptor[] = [{
    field: 'portName',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  @Input() set neId(value: number) {
    if (value == undefined || value == null) {
      return;
    }
    this._neId = value;
    this.httpService.getBoxInfoByNeId(value, (res) => {
      this.context.hideLoading();
      console.log("获取框视图的数据信息");
      console.log(res.content);
      if (!res.content) {
        return;
      }
      this.boxs = [];
      Array.from(res.content).forEach((d: any) => {
        let arr: any[] = d.slotBeans;
        let dishs: any[] = [];
        arr.forEach((item: any) => {
          let d: DishItem = new DishItem();
          d.name = item.defaultBoardName;
          d.slotno = item.slotDisplayNo;
          d.xpos = item.slotXPos;
          d.ypos = item.slotYPos;
          d.width = item.slotWidth;
          d.height = item.slotHeight;
          if (item.currentBoardBean == null) {
            d.isHasDish = false;
            d.dishId = -1;
            d.friendName = '';
            d.remark = '';
          } else {
            d.isHasDish = true;
            d.dishId = item.currentBoardBean.objId;
            d.friendName = item.currentBoardBean.friendName;
            d.remark = item.currentBoardBean.remark;
          }
          dishs.push(d);
        });
        this.boxs.push({ title: d.shelfName, dishs: dishs, slotNoDisplayMode: d.slotNoDisplayMode });
      });
      this.defaultBox = this.boxs[0].title;
      console.log(this.boxs);
    });
  }

  isShowPorts: boolean = false;
  dishName: string;
  defaultBox: string;

  /**
   * 监听框图单盘选中
   */
  listenSelect(data: any) {
    if (data.dishId == -1) {
      this.isShowPorts = false;
      return;
    }
    this.loadProducts();
    this.dishName = data.dishName;
    this.httpService.getSingleDeckByDishId(data.dishId, (res) => {
      this.context.hideLoading();
      console.log('表格数据');
      console.log(res.content);
      let arr: any[] = res.content;
      this.products = [];
      if (!arr || arr.length == 0) {
        this.products = [];
        return;
      }
      arr.forEach((item: any) => {
        let port: DishPort = item as DishPort;
        this.products.push(port);
      })
    })
    this.isShowPorts = true;
  }

  /**
   * 监听表格区域的点击事件
   */
  listenGridViewClick(ev) {
    ev.stopPropagation();
  }

  /**
   * 监听按钮组来定位box位置
   */
  locationBox(boxView: HTMLElement) {
    boxView.scrollTop = 0;
    if (this.boxs[0].title === this.defaultBox) {
      return;
    }
    boxView.scrollTop = boxView.scrollTop + document.getElementById(this.defaultBox).offsetTop - boxView.offsetTop - 10;
    console.log(document.getElementById(this.defaultBox).offsetTop);
  }

  /**
   * 转化连纤状态
   * @param v 
   */
  conversionFiber(v: string) {
    if (v === 'IDLE' || v === 'NULL') {
      return '空闲';
    } else if (v === 'IN') {
      return '收占用';
    } else if (v === 'OUT') {
      return '发占用';
    } else if (v === 'DULEX') {
      return '发占用';
    } else {
      return '';
    }
  }

  /**
   * 转化端口方向
   * @param v 
   */
  conversionDirection(v: string) {
    if (v === 'BIDIRECTION') {
      return '收/发';
    } else if (v === 'IN') {
      return '收';
    } else if (v === 'OUT') {
      return '发';
    } else {
      return '';
    }
  }

  alarmClick() {
    let item = this.tpi.getMenuItem(200010001);//定位到设备框视图界面
    item.pathParam = this._neId;
    this.context.navigate(item);
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadProducts();
  }

  private loadProducts(): void {
    this.gridView = {
      data: orderBy(this.products, this.sort),
      total: this.products.length
    };
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.httpService.unSubscribeAlarmStatus();
  }
}



class DishPort {
  portName: string;//端口名称
  portRemark: string;//端口标注
  projectStatus: number;//工程状态 0 正常态 ；1 工程态
  portNo: number;//端口号
  portTopoStatus: string;//连纤占用状态 IDLE/NULL 空闲 | IN 收占用 | OUT 发占用 | DULEX 收 / 发占用
  inWaveBandLength: string;//端口波长（收）
  outWaveBandLength: string;//端口波长（发）
  portDirection: string;//端口方向  IN 收 | OUT 发 | BIDIRECTION 收/发/ 
}

