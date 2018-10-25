import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterService } from '@waf_service/router';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from '@waf_service/context';
import { TpiService, TpiMenuItem } from '@waf_service/tpi';
import { MenuVModelItem } from './model/menu.model';

/**
 * 菜单组件
 * @export
 * @class MenuComponent
 */
@Component({
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {

  /** 根菜单 */
  rootMenuItems: MenuVModelItem[] = [];

  /** 面包屑 */
  breadcrumb: TpiMenuItem[] = [];

  /**
   * 构建函数
   * @param {Router} router
   * @param {TpiService} tpi
   * @param {ContextService} context
   * @memberof MenuComponent
   */
  constructor(protected logger: LoggerService, protected router: RouterService, protected tpi: TpiService,
    protected context: ContextService) {

  }

  /**
   * 组件初始化
   * @memberof MenuComponent
   */
  ngOnInit(): void {

    // 菜单根节点
    this.tpi.getRootMenuItems().forEach((menuItem: TpiMenuItem) => {
      let vMenuItem = new MenuVModelItem(menuItem);
      vMenuItem.children = this.getChildren(vMenuItem.id);
      this.rootMenuItems.push(vMenuItem);
    });

    // 初始化面包屑
    this.breadcrumb = this.router.getBreadcrumb();

    // 订阅主导航变更事件
    this.context.subscribe("event.service.router.navigate", () => {
      return new Promise((resolve, reject) => {

        // 更改面包屑信息
        this.breadcrumb = this.router.getBreadcrumb();
        resolve();
      });
    });
  }

  /**
   * 渲染成功
   * @memberof ShortcutComponent
   */
  ngAfterViewInit(): void {
    this.context.publish('event.templet.menu.after.view.init');
  }

  /**
   * 点击菜单项
   * @param {MenuVModelItem} item
   * @memberof MenuComponent
   */
  onMenuItemClick(item: MenuVModelItem): void {

    let me = this;
    this.context.publish('event.templet.menu.navigate.start', item).then(
      () => {
        me.router.navigate(this.tpi.getMenuItem(item.id));
      }
    );
  }

  /**
    * 获取某菜单下的所有子菜单
    * @protected
    * @param {number} id
    * @returns {MenuVModelItem[]}
    * @memberof MenuComponent
    */
  protected getChildren(id: number): MenuVModelItem[] {

    let children = this.tpi.getMenuChildren(Number(id));
    if (children.length > 0) {

      let vChildren: MenuVModelItem[] = [];
      children.forEach((tpiMenuItem: TpiMenuItem) => {
        let vChild = new MenuVModelItem(tpiMenuItem);
        vChild.children = this.getChildren(tpiMenuItem.id);
        vChildren.push(vChild);
      });
      return vChildren;
    } else {

      return [];
    }
  }
}


