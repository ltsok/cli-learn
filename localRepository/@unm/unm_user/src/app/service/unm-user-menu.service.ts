import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem } from '@waf_service/tpi';

/**
 * unm_user菜单服务
 * @export
 * @class UnmUserMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class UnmUserMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems: TpiMenuItem[] = [];

    // 主导航-一级菜单：用户（隐藏）
    let menuItem = new TpiMenuItem();
    menuItem.id = 204;
    menuItem.name = 'unm.user';
    menuItem.icon = '';
    menuItem.isHide = true;
    menuItems.push(menuItem);

    // 主导航-二级菜单：用户查询
    let queryMenuItem = new TpiMenuItem();
    queryMenuItem.id = 20400;
    queryMenuItem.name = 'unm.user.query';
    queryMenuItem.icon = '';
    queryMenuItem.parentId = menuItem.id;
    queryMenuItem.isHide = true;
    menuItems.push(queryMenuItem);

    // 主导航-三级菜单：基本信息（快捷导航）
    let queryInfoMenuItem = new TpiMenuItem();
    queryInfoMenuItem.id = 2040000;
    queryInfoMenuItem.name = 'unm.user.query.info';
    queryInfoMenuItem.icon = 'fh-zhudaohangyonghu';
    queryInfoMenuItem.path = '/unm-user/query/user-info';
    queryInfoMenuItem.type.isShortcut = true;
    queryInfoMenuItem.parentId = queryMenuItem.id;
    menuItems.push(queryInfoMenuItem);

    return menuItems;
  }
}
