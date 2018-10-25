import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { ContextService } from "@waf_service/context";
/**
 * 模块壳组件
 * @export
 * @class WafIconComponent
 */
@Component({
  selector: 'waf-icon',
  templateUrl: './waf-icon.component.html',
  styleUrls: ['./waf-icon.component.scss']
})
export class WafIconComponent {
  constructor(private context: ContextService) {

  }
  /**
   * 布局方式 true为中心重合布局，false为环绕布局
   */
  isCenter: boolean = true;
  /**
   * 图标是否闪烁
   */
  _isBlink: boolean = false;

  _style: object = { width: '', height: '', display: 'inline-block' };
  mainIconStyle: object = { width: '', height: '', color: '', top: '', left: '' };
  @Input() set isBlink(value: boolean) {
    this._isBlink = value;
  }
  get isBlink(): boolean {
    return this._isBlink;
  }

  /**
   * 定义布局方式 'center'中心重合布局  'surround'环绕布局
   */
  @Input() set way(value: string) {
    if (value == 'surround') {//环绕布局
      this.isCenter = false;
    } else {//中心重合
      this.isCenter = true;
    }
  }
  /**
   * 主图标
   */
  @Input() mainIcon: string
  /**
   * 主图标的尺寸
   */
  _mainIconSize: number;
  @Input() set icons(value: any) {
    if (!value || value.length == 0) {
      return;
    }
    this._mainIconSize = value.mainSize;
    this.mainIconStyle['width'] = value.mainSize + 'px';
    this.mainIconStyle['height'] = value.mainSize + 'px';
    this.mainIconStyle['line-height'] = value.mainSize + 'px';
    this._style['width'] = value.mainSize + 'px';
    this._style['height'] = value.mainSize + 'px';
    if (!this.isCenter) {
      this.setAroundIconSize(value.aroundSize, value.aroundIcons);
    } else {
      Array.from(value.aroundIcons).forEach((item: any) => {
        item['style'] = { width: value.aroundSize + 'px', height: value.aroundSize + 'px', color: item.color }
      });
    }
    this._aroundIcons = value.aroundIcons as Array<any>;
  }

  @Input() set mainIconFontSize(value: number) {
    let v = value + '';
    if (!v) {
      return;
    }
    this.mainIconStyle['font-size'] = v + 'px';
  }

  @Input() set style(value: object) {
    for (let key in value) {
      this._style[key] = value[key];
    }
  }
  /**
   * 主图标的颜色
   */
  @Input() set mainIconColor(value: string) {
    this.mainIconStyle['color'] = value;
  };
  @Input() set borderColor(value: string) {
    if (value) {
      this.mainIconStyle['border'] = '1px solid ' + value;
    }
  }
  /**
   * 环绕的图标数组
   */
  _aroundIcons: Array<any> = [];
  /**
   * 环绕图标的尺寸
   */
  setAroundIconSize(value: number, icons: any) {
    let top = 0;
    let left = 0;
    let right = 0;
    let bottom = 0;
    if (!icons) return;
    icons.forEach((item: any) => {
      let site: string = item.site;
      if (site.substr(0, 3) === 'top') {
        top > 0 ? top : top = value;
      } else if (site.substr(0, 4) === 'left') {
        left > 0 ? left : left = value;
      } else if (site.substr(0, 5) === 'right') {
        right > 0 ? right : right = value
      } else if (site.substr(0, 6) === 'bottom') {
        bottom > 0 ? bottom : bottom = value;
      }
    });
    let h = this._mainIconSize;
    let w = this._mainIconSize;
    let mainL = 0;
    let mainT = 0;
    if (top > 0) {
      h = h + top;
      this.mainIconStyle['top'] = value + 'px';
      mainT = value;
    }
    if (left > 0) {
      w = w + left;
      this.mainIconStyle['left'] = value + 'px';
      mainL = value;
    }
    if (right > 0) {
      w = w + right;
    }
    if (bottom > 0) {
      h = h + bottom;
    }
    this._style['width'] = w + 'px';
    this._style['height'] = h + 'px';
    icons.forEach((item: any) => {
      item['style'] = this.getAroudStyle(mainL, mainT, this._mainIconSize, this._mainIconSize, item['site'], item['color'], value);
    });
  }

  /**
   * 环绕布局时环绕图标的样式获取方法
   * @param site 
   */
  getAroudStyle(l: number, t: number, h: number, w: number, site: string, color: string, size: number) {
    let fontSize = size < 12 ? 0 : size;
    let style = { width: size + 'px', height: size + 'px', lineHeight: size + 'px', top: '', left: '', color: color, fontSize: '12px' };
    if (fontSize == 0) {
      style.width = '12px';
      style.height = '12px';
      style['transform'] = `scale(${size / 12})`
    } else {
      style['fontSize'] = fontSize + 'px';
    }
    if (!site) {
      return;
    }
    if (site === 'topCenter') {
      style.top = '0px';
      style.left = (w / 2 - size / 2) + l + 'px';
    } else if (site === 'topLeft') {
      style.top = '0px';
      style.left = l + 'px';
    } else if (site === 'topRight') {
      style.top = '0px';
      style.left = (l + w - size) + 'px';
    } else if (site === 'leftTop') {
      style.left = '0px';
      style.top = t + 'px';
    } else if (site === 'leftCenter') {
      style.left = '0px';
      style.top = (h / 2 - size / 2) + t + 'px';
    } else if (site === 'leftBottom') {
      style.left = '0px';
      style.top = (h + t - size) + 'px';
    } else if (site === 'rightTop') {
      style.left = w + l + 'px';
      style.top = t + 'px';
    } else if (site === 'rightCenter') {
      style.left = w + l + 'px';
      style.top = (h / 2 - size / 2) + t + 'px';
    } else if (site === 'rightBottom') {
      style.left = w + l + 'px';
      style.top = (h + t - size) + 'px';
    } else if (site === 'bottomCenter') {
      style.top = h + t + 'px';
      style.left = (w / 2 - size / 2) + l + 'px';
    } else if (site === 'bottomLeft') {
      style.left = l + 'px';
      style.top = h + t + 'px';
    } else if (site === 'bottomRight') {
      style.left = (l + w - size) + 'px';
      style.top = h + t + 'px';
    }
    return style;
  }
}
