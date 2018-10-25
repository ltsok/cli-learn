import { Component, OnInit, ViewChild, ElementRef, Renderer2, ViewContainerRef, Output, EventEmitter, Input } from '@angular/core';
import { constant } from '../unm-ne-manager.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { element } from 'protractor';
declare var require: any;
/**
 * box-view
 * @export
 * @class BoxViewComponent
 */
@Component({
  selector: 'box-view',
  templateUrl: './box-view.component.html',
  styleUrls: ['./box-view.component.scss']
})
export class BoxViewComponent {
  /**
 * 构造函数
 * @param {LoggerService} logger
 * @param {ContextService} context
 * @memberof UnmNeManagerModule
 */
  constructor(private logger: LoggerService, private context: ContextService, private ren: Renderer2) {
    this.ren.listen('document', 'click', (ev) => {
      this.menu.nativeElement.style.display = 'none';
      this.removeSelect();
    });
  }
  dataList: Array<DishItem> = new Array<DishItem>();//数据源
  menuDisplay: boolean = false;//右键操作目录 默认隐藏
  width: string;
  height: string;
  dataIndex: number = null;//右键操作的数据索引位置
  isNull = true;
  @Input() boxTitle: string;//框图title
  @Input() adecimal: number;//1 是十进制 0 是十六进制
  @Input() dishBgColor: string = '#51c660';
  /**
   * 外部传入框图盘数据，再根据数据计算框尺寸
   */
  @Input() set dishData(value: DishItem[]) {
    if (!value) return;
    this.dataList = value;
    this.sizeChange();
  }

  /**
   * 将推送过来的上报数据进行更新
   */
  @Input() set dishChange(value: DishItem[]) {
    if (!value) return;
    for (let i = 0; i < value.length; i++) {
      let v: DishItem = value[i];
      for (let j = 0; j < this.dataList.length; j++) {
        let item = this.dataList[j];
        if (v.dishId === item.dishId) {
          item = v;
          break;
        }
      }
    }
  }

  @Output() selectClick = new EventEmitter();
  @ViewChild('div') menu: ElementRef;
  @ViewChild('ul') ul: ElementRef;

  /**
   * 数据计算框尺寸方法
   */
  sizeChange() {
    let _w: number = 0;
    let _h: number = 0;
    this.dataList.forEach((item: DishItem) => {
      if (item.ypos === 0) {
        let w = item.xpos + item.width;
        if (w > _w) {
          _w = w;
        }
      }
      if (item.xpos === 0) {
        let h = item.ypos + item.height;
        if (h > _h) {
          _h = h;
        }
      }
    });
    this.width = _w + 10 + 'px';
    this.height = _h + 'px';
  }

  /**
   * 根据数据来给盘的样式
   * @param data 
   */
  getStyle(data: DishItem): object {
    let obj = { 'width': data.width + 'px', 'height': data.height + 'px', 'left': data.xpos + 'px', 'top': data.ypos + 'px' };//'background-color': this.dishBgColor
    if (!data.isHasDish) {
      if (data.width > data.height) {
        obj['display'] = 'flex';
        obj['align-items'] = 'center';
      }
    } else {
      obj['background-color'] = this.dishBgColor;
    }
    return obj;
  }

  /**
   * 根据数据判断该盘的显示样式
   * @param data 
   */
  getClass(data: DishItem) {
    if (data.height < data.width) {
      return "across";
    } else {
      return "good";
    }
  }

  /**
   * 根据数据给告警灯颜色
   * @param color 
   */
  getAlarmColor(color: string) {
    return {
      background: `linear-gradient(to bottom, white, ${color})`,
      border: `1px solid ${color}`,
    }
  }

  /**
   * 选中一个盘
   * @param li 
   * @param event 
   */
  select(li: HTMLLIElement, dishId: number, dishName: string, event) {
    event.stopPropagation();
    this.menu.nativeElement.style.display = 'none';
    this.removeSelect();
    li.classList.add('select');
    this.selectClick.emit({ dishId: dishId, dishName: dishName });
  }

  /**
   * 右键菜单事件
   * @param ev 
   * @param liDom 
   */
  rightContextMenu(ev: MouseEvent, index: number, liDom: HTMLLIElement) {
    ev.preventDefault();
    this.dataIndex = index;
    if (liDom.classList.contains('bad')) {
      this.isNull = true;
    } else {
      this.isNull = false;
    }
    this.menu.nativeElement.style.display = 'block';
    let pos = this.getMousePos(ev);
    this.menu.nativeElement.style.top = pos.y + 'px';
    this.menu.nativeElement.style.left = pos.x + 'px';
  }

  /**
   * 计算当前数据的坐标位置
   * @param event 
   */
  getMousePos(event) {
    let e = event || window.event;
    let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    let x = e.pageX || e.clientX + scrollX;
    let y = e.pageY || e.clientY + scrollY;
    return { 'x': x - 228, 'y': y - 207 };
  }

  /**
   * 右键菜单单个item的点击事件
   * @param type 
   */
  itemClick(type: number) {
    let item = this.dataList[this.dataIndex];
    if (type === 0) {
      item.isHasDish = true;
      item.name = 'test'
    } else if (type === 1) {
      item.isHasDish = false;
    } else if (type === 2) {
      item.name = "test update";
    } else {
      this.menu.nativeElement.style.display = 'none';
    }
  }

  /**
   * 去除盘上的选中样式
   */
  removeSelect() {
    let oli: HTMLLIElement = this.ul.nativeElement.querySelector('li.select');
    if (oli) {
      oli.classList.remove('select');
    }
  }

  /**
   * 获取字符串数组
   */
  replaceName(name: string) {
    name = name.replace('_', '|');
    let len: number = name.length;
    let str: string[] = [];
    for (let i = 0; i < len; i++) {
      str[i] = name[i];
    }
    return str;
  }

  /**
   * 根据宽或高来确定盘文本域的宽或高
   * @param size 
   */
  getTextAreaSize(type: number, size: number) {
    let num = 0;
    num = size - 4 - 20 - 15 - 8 - 30;
    let obj = {};
    if (num <= 0) {
      obj = { display: 'none' };
    } else {
      if (type === 0) {
        obj = { width: num + 'px' }
      } else {
        obj = { height: num + 'px' }
      }
    }
    return obj;
  }

}

export class DishItem {
  slotno: number;//框内槽编号
  name: string; //盘名称
  lightColor: string = 'black';//告警灯颜色
  isBreakLine: boolean = true;//是否显示断纤的标识 true 为不显示 false 为显示
  xpos: number;//槽位X坐标
  ypos: number;//槽位Y坐标
  width: number;//槽位宽度
  height: number;//槽位高度
  isHasDish: boolean;//是否有插盘
  dishId: number;//盘ID
  friendName: string;//盘友好名
  remark: string;//单盘备注
}


