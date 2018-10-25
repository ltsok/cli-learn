import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem } from '@waf_service/tpi';

/**
 * unm_logger菜单服务
 * @export
 * @class UnmLoggerMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class UnmLoggerMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems: TpiMenuItem[] = [];

    // 主导航-一级菜单：日志（隐藏）
    let menuItem = new TpiMenuItem();
    menuItem.id = 206;
    menuItem.name = 'unm.logger';
    menuItem.icon = '';
    menuItem.isHide = true;
    menuItems.push(menuItem);

    // 主导航-二级菜单：日志查询
    let queryMenuItem = new TpiMenuItem();
    queryMenuItem.id = 20600;
    queryMenuItem.name = 'unm.logger.query';
    queryMenuItem.icon = '';
    queryMenuItem.parentId = menuItem.id;
    queryMenuItem.isHide = true;
    menuItems.push(queryMenuItem);

    // 快捷导航：日志管理（快捷导航）
    let queryU2kMenuItem = new TpiMenuItem();
    queryU2kMenuItem.id = 2060000;
    queryU2kMenuItem.name = 'unm.logger.query.u2k';
    queryU2kMenuItem.icon = 'fh-zhudaohangrizhi';
    queryU2kMenuItem.path = '/unm-logger/query/logger-u2k';
    queryU2kMenuItem.type.isShortcut = true;
    queryU2kMenuItem.parentId = queryMenuItem.id;
    menuItems.push(queryU2kMenuItem);

    return menuItems;
  }
}
