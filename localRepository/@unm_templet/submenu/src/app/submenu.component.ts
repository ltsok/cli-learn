import { Component } from '@angular/core';
import { MenuComponent, MenuVModelItem } from '@unm_templet/menu';

/**
 * 模块壳组件
 * @export
 * @class SubmenuComponent
 */
@Component({
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.scss']
})
export class SubmenuComponent extends MenuComponent {

  /** 子导航入口菜单项 */
  subMenuItemId: number;

  /** 选中子导航父菜单项 */
  selectGroup: Map<number, boolean> = new Map<number, boolean>();

  /** 选中子导航菜单项 */
  select: Map<number, boolean> = new Map<number, boolean>();

  /** 展开子导航菜单项 */
  open: Map<number, boolean> = new Map<number, boolean>();

  /**
   * 组件初始化
   * @memberof SubmenuComponent
   */
  ngOnInit(): void {

    this.initSubMenu(this.context.getRouterParam());

    // 订阅主导航变更事件
    this.context.subscribe("event.service.router.navigate", (event) => {
      return new Promise((resolve, reject) => {

        // 获取当前面包屑
        let breadcrumb = this.router.getBreadcrumb();

        // 子导航上的变更
        if (breadcrumb.length >= 3) {

          // 初始化子导航
          if (breadcrumb.length === 3) {
            this.initSubMenu({ subMenuItemParentId: breadcrumb[2].id });
          } else {
            this.initSubMenu({ subMenuItemParentId: breadcrumb[2].id, destMenuItemId: event.afterMenuItemId });
          }

          // 子导航选中和面包屑一致
          this.select.clear();
          this.select.set(breadcrumb[breadcrumb.length - 1].id, true);
          this.selectGroup.clear();
          this.selectGroup.set(breadcrumb[breadcrumb.length - 2].id, true);
        }

        resolve();
      });
    });
  }

  /**
   * 渲染成功
   * @memberof ShortcutComponent
   */
  ngAfterViewInit(): void {
    this.context.publish('event.templet.submenu.after.view.init');
  }

  /**
   * 初始化子导航
   * @private
   * @param {*} input
   * @returns {void}
   * @memberof SubmenuComponent
   */
  private initSubMenu(input: any): void {

    // 获取输入参数
    let parentId = input.subMenuItemParentId;
    let destId = input.destMenuItemId;

    if (parentId === this.subMenuItemId) {
      return;
    }

    // 获取子导航的菜单信息
    this.subMenuItemId = parentId;
    this.rootMenuItems = this.getChildren(this.subMenuItemId);

    // 设置默认选中项
    this.select.clear();
    let subRootMenuItem = this.tpi.getMenuItem(this.subMenuItemId);
    if (destId) {
      this.select.set(destId, true);
    } else if (subRootMenuItem.linkId) {
      this.select.set(subRootMenuItem.linkId, true);
    }

    // 设置展开项
    this.open.clear();
    if (destId) {
      this.open.set(this.tpi.getMenuItem(destId).parentId, true);
    } else if (subRootMenuItem.linkId) {
      this.open.set(this.tpi.getMenuItem(subRootMenuItem.linkId).parentId, true);
    }
  }

  /**
   * 点击菜单项
   * @param {MenuVModelItem} item
   * @memberof MenuComponent
   */
  onMenuItemClick(item: MenuVModelItem): void {

    let me = this;
    this.context.publish('event.templet.submenu.navigate.start', item).then(
      () => {
        me.router.navigate(this.tpi.getMenuItem(item.id));
      }
    );
  }

  /**
   * 点击父菜单展开收拢
   * @param {MenuVModelItem} item
   * @memberof SubmenuComponent
   */
  onOpen(item: MenuVModelItem): void {
    let isOpen = this.open.get(item.id);
    this.open.clear();
    this.open.set(item.id, !isOpen);
  }
}
