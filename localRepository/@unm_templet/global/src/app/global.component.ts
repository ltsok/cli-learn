import { Component } from '@angular/core';

/**
 * 全局组件
 * @export
 * @class GlobalComponent
 */
@Component({
  selector: 'classic-global',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.scss']
})
export class GlobalComponent {

  isScroll: boolean = false;

  /**
   * 构造函数
   * @memberof GlobalComponent
   */
  constructor() {

    let me = this;
    window.addEventListener('scroll', () => {
      if (0 === window.scrollY) {
        me.isScroll = false;
      } else {
        me.isScroll = true;
      }
    });
  }

  /**
   * 到顶
   * @memberof GlobalComponent
   */
  onTop(): void {
    window.scrollTo(0, 0);
  }
}
