import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem } from '@waf_service/tpi';

/**
 * 主页菜单服务
 * @export
 * @class PortalMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class PortalMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems: TpiMenuItem[] = [];

    // 主导航-一级菜单：首页
    let menuItem = new TpiMenuItem();
    menuItem.id = 100;
    menuItem.name = 'portal';
    menuItem.icon = '';
    menuItem.path = '/portal/default';
    menuItem.isShowBreadcrumb = false;
    menuItem.type.isResidentPage = true;
    menuItems.push(menuItem);

    return menuItems;
  }
}
