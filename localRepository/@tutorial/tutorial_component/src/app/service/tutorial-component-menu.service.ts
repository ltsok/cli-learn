import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem } from '@waf_service/tpi';

/**
 * tutorial_component菜单服务
 * @export
 * @class TutorialComponentMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class TutorialComponentMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems: TpiMenuItem[] = [];

    // 主导航-一级菜单：控件教程
    let menuItem = new TpiMenuItem();
    menuItem.id = 302;
    menuItem.name = 'tutorial.component';
    menuItem.icon = '';
    menuItems.push(menuItem);

    // 主导航-二级菜单：设计简介
    let componentDesignMenuItem = new TpiMenuItem();
    componentDesignMenuItem.id = 30200;
    componentDesignMenuItem.name = 'tutorial.component.component-design';
    componentDesignMenuItem.icon = '';
    componentDesignMenuItem.parentId = menuItem.id;
    menuItems.push(componentDesignMenuItem);

    // 主导航-三级菜单：控件设计思想
    let componentThoughtMenuItem = new TpiMenuItem();
    componentThoughtMenuItem.id = 3020000;
    componentThoughtMenuItem.name = 'tutorial.component.component-design.component-thought';
    componentThoughtMenuItem.icon = '';
    componentThoughtMenuItem.path = '/tutorial-component/component-design/component-thought';
    componentThoughtMenuItem.parentId = componentDesignMenuItem.id;
    menuItems.push(componentThoughtMenuItem);

    // 主导航-二级菜单：控件使用
    let componentUsageMenuItem = new TpiMenuItem();
    componentUsageMenuItem.id = 30201;
    componentUsageMenuItem.name = 'tutorial.component.component-usage';
    componentUsageMenuItem.icon = '';
    componentUsageMenuItem.parentId = menuItem.id;
    menuItems.push(componentUsageMenuItem);

    // 主导航-三级菜单：自研控件
    let selfinnovateMenuItem = new TpiMenuItem();
    selfinnovateMenuItem.id = 3020100;
    selfinnovateMenuItem.name = 'tutorial.component.component-usage.selfinnovate';
    selfinnovateMenuItem.icon = '';
    selfinnovateMenuItem.linkId = 30201000000;
    selfinnovateMenuItem.parentId = componentUsageMenuItem.id;
    menuItems.push(selfinnovateMenuItem);

    // 主导航-四级菜单：平台基础控件
    let basicMenuItem = new TpiMenuItem();
    basicMenuItem.id = 302010000;
    basicMenuItem.name = 'tutorial.component.component-usage.selfinnovate.basic';
    basicMenuItem.icon = '';
    basicMenuItem.parentId = selfinnovateMenuItem.id;
    menuItems.push(basicMenuItem);

    // 主导航-五级菜单：叠加图标
    let overlayiconMenuItem = new TpiMenuItem();
    overlayiconMenuItem.id = 30201000000;
    overlayiconMenuItem.name = 'tutorial.component.component-usage.selfinnovate.basic.overlayicon';
    overlayiconMenuItem.icon = '';
    overlayiconMenuItem.path = '/tutorial-component/component-usage/self-innovate/basic-component/overlay-icon';
    overlayiconMenuItem.parentId = basicMenuItem.id;
    menuItems.push(overlayiconMenuItem);

    // 主导航-五级菜单：布局
    let layoutMenuItem = new TpiMenuItem();
    layoutMenuItem.id = 3020100000001;
    layoutMenuItem.name = 'tutorial.component.component-usage.selfinnovate.basic.layout';
    layoutMenuItem.icon = '';
    layoutMenuItem.path = '/tutorial-component/component-usage/self-innovate/basic-component/layout';
    layoutMenuItem.parentId = basicMenuItem.id;
    menuItems.push(layoutMenuItem);

    // 主导航-四级菜单：业务公共控件
    let commonMenuItem = new TpiMenuItem();
    commonMenuItem.id = 302010001;
    commonMenuItem.name = 'tutorial.component.component-usage.selfinnovate.common';
    commonMenuItem.icon = '';
    commonMenuItem.parentId = selfinnovateMenuItem.id;
    menuItems.push(commonMenuItem);

    // 主导航-五级菜单：对象选择器
    let objectMenuItem = new TpiMenuItem();
    objectMenuItem.id = 30201000100;
    objectMenuItem.name = 'tutorial.component.component-usage.selfinnovate.common.object';
    objectMenuItem.icon = '';
    objectMenuItem.path = '/tutorial-component/component-usage/self-innovate/common-component/select-object';
    objectMenuItem.parentId = commonMenuItem.id;
    menuItems.push(objectMenuItem);

    // 主导航-三级菜单：第三方控件
    let thirdPartyMenuItem = new TpiMenuItem();
    thirdPartyMenuItem.id = 3020101;
    thirdPartyMenuItem.name = 'tutorial.component.component-usage.thirdParty';
    thirdPartyMenuItem.icon = '';
    thirdPartyMenuItem.linkId = 302010100;
    thirdPartyMenuItem.parentId = componentUsageMenuItem.id;
    menuItems.push(thirdPartyMenuItem);

    // 主导航-四级菜单：ng-zorro
    let ngzorroMenuItem = new TpiMenuItem();
    ngzorroMenuItem.id = 302010100;
    ngzorroMenuItem.name = 'tutorial.component.component-usage.thirdParty.ngzorro';
    ngzorroMenuItem.icon = '';
    ngzorroMenuItem.path = '/tutorial-component/component-usage/third-party/ng-zorro';
    ngzorroMenuItem.parentId = thirdPartyMenuItem.id;
    menuItems.push(ngzorroMenuItem);

    // 主导航-四级菜单：kendoui
    let kendouiMenuItem = new TpiMenuItem();
    kendouiMenuItem.id = 302010101;
    kendouiMenuItem.name = 'tutorial.component.component-usage.thirdParty.kendoui';
    kendouiMenuItem.icon = '';
    kendouiMenuItem.path = '/tutorial-component/component-usage/third-party/KenDo';
    kendouiMenuItem.parentId = thirdPartyMenuItem.id;
    menuItems.push(kendouiMenuItem);

    // 主导航-四级菜单：echarts
    let echartsMenuItem = new TpiMenuItem();
    echartsMenuItem.id = 302010102;
    echartsMenuItem.name = 'tutorial.component.component-usage.thirdParty.echarts';
    echartsMenuItem.icon = '';
    echartsMenuItem.path = '/tutorial-component/component-usage/third-party/echarts';
    echartsMenuItem.parentId = thirdPartyMenuItem.id;
    menuItems.push(echartsMenuItem);

    // 主导航-四级菜单：animate
    let animateMenuItem = new TpiMenuItem();
    animateMenuItem.id = 302010103;
    animateMenuItem.name = 'tutorial.component.component-usage.thirdParty.animate';
    animateMenuItem.icon = '';
    animateMenuItem.path = '/tutorial-component/component-usage/third-party/animate';
    animateMenuItem.parentId = thirdPartyMenuItem.id;
    menuItems.push(animateMenuItem);

    // 主导航-四级菜单：ztree
    let ztreeMenuItem = new TpiMenuItem();
    ztreeMenuItem.id = 302010104;
    ztreeMenuItem.name = 'tutorial.component.component-usage.thirdParty.ztree';
    ztreeMenuItem.icon = '';
    ztreeMenuItem.path = '/tutorial-component/component-usage/third-party/ztree';
    ztreeMenuItem.parentId = thirdPartyMenuItem.id;
    menuItems.push(ztreeMenuItem);

    return menuItems;
  }
}
