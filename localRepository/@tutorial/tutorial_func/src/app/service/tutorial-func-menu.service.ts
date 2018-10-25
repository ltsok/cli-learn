import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem, TpiMenuItemType } from '@waf_service/tpi';

/**
 * tutorial_func菜单服务
 * @export
 * @class TutorialFuncMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class TutorialFuncMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems:TpiMenuItem[] = [];

    // 主导航-一级菜单：通用功能
    let menuItem = new TpiMenuItem();
    menuItem.id = 305;
    menuItem.name = 'tutorial.func';
    menuItem.icon = '';
    menuItems.push(menuItem);

    // 主导航-二级菜单：设计简介
    let funcDesignMenuItem = new TpiMenuItem();
    funcDesignMenuItem.id = 30500;
    funcDesignMenuItem.name = 'tutorial.func.func-design';
    funcDesignMenuItem.icon = '';
    funcDesignMenuItem.parentId = menuItem.id;
    menuItems.push(funcDesignMenuItem);

    // 主导航-三级菜单：通用功能设计思想
    let funcThoughtMenuItem = new TpiMenuItem();
    funcThoughtMenuItem.id = 3050000;
    funcThoughtMenuItem.name = 'tutorial.func.func-design.func-thought';
    funcThoughtMenuItem.icon = '';
    funcThoughtMenuItem.path = '/tutorial-func/func-design/func-thought';
    funcThoughtMenuItem.parentId = funcDesignMenuItem.id;
    menuItems.push(funcThoughtMenuItem);

    // 主导航：二级菜单：门户
    let funcGatewayMenuItem = new TpiMenuItem();
    funcGatewayMenuItem.id = 30501;
    funcGatewayMenuItem.name= 'tutorial.func.func-portal';
    funcGatewayMenuItem.icon = '';
    funcGatewayMenuItem.parentId = menuItem.id;
    menuItems.push(funcGatewayMenuItem);

    // 主导航-三级菜单：门户介绍
    let gatewayIntroduceMenuItem = new TpiMenuItem();
    gatewayIntroduceMenuItem.id = 3050100;
    gatewayIntroduceMenuItem.name = 'tutorial.func.func-portal.portal-introduce';
    gatewayIntroduceMenuItem.icon = '';
    gatewayIntroduceMenuItem.path = '/tutorial-func/func-portal/portal-introduce';
    gatewayIntroduceMenuItem.parentId = funcGatewayMenuItem.id;
    menuItems.push(gatewayIntroduceMenuItem);

    // 主导航-三级菜单：模板布局
    let templetLayoutMenuItem = new TpiMenuItem();
    templetLayoutMenuItem.id = 3050102;
    templetLayoutMenuItem.name = 'tutorial.func.func-portal.templet-layout';
    templetLayoutMenuItem.icon = '';
    templetLayoutMenuItem.path = '/tutorial-func/func-portal/templet-layout';
    templetLayoutMenuItem.parentId = funcGatewayMenuItem.id;
    menuItems.push(templetLayoutMenuItem);

    // 主导航-三级菜单：自动布局
    let selfmotionMenuItem = new TpiMenuItem();
    selfmotionMenuItem.id = 3050101;
    selfmotionMenuItem.name = 'tutorial.func.func-portal.auto-layout';
    selfmotionMenuItem.icon = '';
    selfmotionMenuItem.linkId = 305010100;
    selfmotionMenuItem.parentId = funcGatewayMenuItem.id;
    menuItems.push(selfmotionMenuItem);

    // 主导航-四级菜单：行内自动布局
    let inlineMotionMenuItem = new TpiMenuItem();
    inlineMotionMenuItem.id = 305010100;
    inlineMotionMenuItem.name = 'tutorial.func.func-portal.auto-layout.row-layout';
    inlineMotionMenuItem.icon = '';
    inlineMotionMenuItem.path = '/tutorial-func/func-portal/auto-layout/row-layout';
    inlineMotionMenuItem.parentId = selfmotionMenuItem.id;
    menuItems.push(inlineMotionMenuItem);

    // 主导航-四级菜单：列内自动布局
    let columnMotionMenuItem = new TpiMenuItem();
    columnMotionMenuItem.id = 305010101;
    columnMotionMenuItem.name = 'tutorial.func.func-portal.auto-layout.column-layout';
    columnMotionMenuItem.icon = '';
    columnMotionMenuItem.path = '/tutorial-func/func-portal/auto-layout/column-layout';
    columnMotionMenuItem.parentId = selfmotionMenuItem.id;
    menuItems.push(columnMotionMenuItem);

    // 主导航-四级菜单：等大自动布局
    let unitlargeMotionMenuItem = new TpiMenuItem();
    unitlargeMotionMenuItem.id = 305010102;
    unitlargeMotionMenuItem.name = 'tutorial.func.func-portal.auto-layout.same-size-layout';
    unitlargeMotionMenuItem.icon = '';
    unitlargeMotionMenuItem.path = '/tutorial-func/func-portal/auto-layout/same-size-layout';
    unitlargeMotionMenuItem.parentId = selfmotionMenuItem.id;
    menuItems.push(unitlargeMotionMenuItem);

    return menuItems;
  }
}
