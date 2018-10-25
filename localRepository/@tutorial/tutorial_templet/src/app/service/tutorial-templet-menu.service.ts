import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem, TpiMenuItemType } from '@waf_service/tpi';

/**
 * tutorial_templet菜单服务
 * @export
 * @class TutorialTempletMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class TutorialTempletMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems:TpiMenuItem[] = [];

    // 主导航-一级菜单：模板教程
    let menuItem = new TpiMenuItem();
    menuItem.id = 304;
    menuItem.name = 'tutorial.templet';
    menuItem.icon = '';
    menuItems.push(menuItem);

    // 主导航-二级菜单：设计简介
    let templetDesignMenuItem = new TpiMenuItem();
    templetDesignMenuItem.id = 30400;
    templetDesignMenuItem.name = 'tutorial.templet.templet-design';
    templetDesignMenuItem.icon = '';
    templetDesignMenuItem.parentId = menuItem.id;
    menuItems.push(templetDesignMenuItem);

    // 主导航-三级菜单：模板设计思想
    let templetThoughtMenuItem = new TpiMenuItem();
    templetThoughtMenuItem.id = 3040000;
    templetThoughtMenuItem.name = 'tutorial.templet.templet-design.templet-thought';
    templetThoughtMenuItem.icon = '';
    templetThoughtMenuItem.path = '/tutorial-templet/templet-design/templet-thought';
    templetThoughtMenuItem.parentId = templetDesignMenuItem.id;
    menuItems.push(templetThoughtMenuItem);

    // 主导航-二级菜单：web模板
    let templetWebMenuItem = new TpiMenuItem();
    templetWebMenuItem.id = 30401;
    templetWebMenuItem.name = 'tutorial.templet.templet-web';
    templetWebMenuItem.icon = '';
    templetWebMenuItem.parentId = menuItem.id;
    menuItems.push(templetWebMenuItem);

    // 主导航-三级菜单：classic模板
    let templetClassicMenuItem = new TpiMenuItem();
    templetClassicMenuItem.id = 3040100;
    templetClassicMenuItem.name = 'tutorial.templet.templet-web.templet-classic';
    templetClassicMenuItem.icon = '';
    templetClassicMenuItem.path = '/tutorial-templet/templet-web/templet-classic';
    templetClassicMenuItem.parentId = templetWebMenuItem.id;
    menuItems.push(templetClassicMenuItem);

    // 主导航-三级菜单：unm模板
    let templetUnmMenuItem = new TpiMenuItem();
    templetUnmMenuItem.id = 3040101;
    templetUnmMenuItem.name = 'tutorial.templet.templet-web.templet-unm';
    templetUnmMenuItem.icon = '';
    templetUnmMenuItem.path = '/tutorial-templet/templet-web/templet-unm';
    templetUnmMenuItem.parentId = templetWebMenuItem.id;
    menuItems.push(templetUnmMenuItem);

    return menuItems;
  }
}
