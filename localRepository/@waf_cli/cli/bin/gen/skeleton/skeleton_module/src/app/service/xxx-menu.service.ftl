import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem } from '@waf_service/tpi';

/**
 * {{module.name}}菜单服务
 * @export
 * @class {{module.camelName}}MenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class {{module.camelName}}MenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems:TpiMenuItem[] = [];

    // 父菜单
    // TODO:菜单信息根据实际情况修改
    let menuItem = new TpiMenuItem();
    menuItem.id = {{module.menuId}};
    menuItem.name = '{{module.i18n}}';
    menuItem.icon = '';
    menuItems.push(menuItem);

    // 默认子菜单
    // TODO:子菜单信息根据实际情况修改
    let defaultMenuItem = new TpiMenuItem();
    defaultMenuItem.id = {{module.menuId}}00;
    defaultMenuItem.name = '{{module.i18n}}.default';
    defaultMenuItem.icon = '';
    defaultMenuItem.path = '/{{module.prefix}}';
    defaultMenuItem.parentId = menuItem.id;
    menuItems.push(defaultMenuItem);

    return menuItems;
  }
}
