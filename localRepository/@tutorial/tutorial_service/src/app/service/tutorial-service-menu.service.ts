import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem, TpiMenuItemType } from '@waf_service/tpi';

/**
 * tutorial_service菜单服务
 * @export
 * @class TutorialServiceMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class TutorialServiceMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems:TpiMenuItem[] = [];

    // 主导航-一级菜单：服务教程
    let menuItem = new TpiMenuItem();
    menuItem.id = 301;
    menuItem.name = 'tutorial.service';
    menuItem.icon = '';
    menuItems.push(menuItem);

    // 主导航-二级菜单：设计简介
    let serviceDesignMenuItem = new TpiMenuItem();
    serviceDesignMenuItem.id = 30100;
    serviceDesignMenuItem.name = 'tutorial.service.serviceDesign';
    serviceDesignMenuItem.icon = '';
    serviceDesignMenuItem.parentId = menuItem.id;
    menuItems.push(serviceDesignMenuItem);

    // 主导航-二级菜单：服务使用
    let serviceUsageMenuItem = new TpiMenuItem();
    serviceUsageMenuItem.id = 30101;
    serviceUsageMenuItem.name = 'tutorial.service.serviceUsage';
    serviceUsageMenuItem.icon = '';
    serviceUsageMenuItem.parentId = menuItem.id;
    menuItems.push(serviceUsageMenuItem);

    // 主导航-三级菜单：服务设计思想
    let serviceThoughtMenuItem = new TpiMenuItem();
    serviceThoughtMenuItem.id = 3010000;
    serviceThoughtMenuItem.name = 'tutorial.service.serviceDesign.serviceThought';
    serviceThoughtMenuItem.icon = '';
    serviceThoughtMenuItem.path = '/tutorial-service/service-design/service-thought';
    serviceThoughtMenuItem.parentId = serviceDesignMenuItem.id;
    menuItems.push(serviceThoughtMenuItem);

    // 主导航-三级菜单：应用服务
    let applyMenuItem = new TpiMenuItem();
    applyMenuItem.id = 3010100;
    applyMenuItem.name = 'tutorial.service.serviceUsage.apply';
    applyMenuItem.icon = '';
    applyMenuItem.linkId = 301010000;
    applyMenuItem.parentId = serviceUsageMenuItem.id;
    menuItems.push(applyMenuItem);

    // 主导航-四级菜单：上下文服务
    let contextMenuItem = new TpiMenuItem();
    contextMenuItem.id = 301010000;
    contextMenuItem.name = 'tutorial.service.serviceUsage.apply.context';
    contextMenuItem.icon = '';
    contextMenuItem.path = '/tutorial-service/service-usage/apply/context';
    contextMenuItem.parentId = applyMenuItem.id;
    menuItems.push(contextMenuItem);

    // 主导航-四级菜单：推送服务
    let pushMenuItem = new TpiMenuItem();
    pushMenuItem.id = 301010001;
    pushMenuItem.name = 'tutorial.service.serviceUsage.apply.push';
    pushMenuItem.icon = '';
    pushMenuItem.path = '/tutorial-service/service-usage/apply/push';
    pushMenuItem.parentId = applyMenuItem.id;
    menuItems.push(pushMenuItem);

    // 主导航-四级菜单：Http服务
    let HttpMenuItem = new TpiMenuItem();
    HttpMenuItem.id = 301010002;
    HttpMenuItem.name = 'tutorial.service.serviceUsage.apply.http';
    HttpMenuItem.icon = '';
    HttpMenuItem.path = '/tutorial-service/service-usage/apply/http';
    HttpMenuItem.parentId = applyMenuItem.id;
    menuItems.push(HttpMenuItem);

    // 主导航-三级菜单：基础服务
    let bassicMenuItem = new TpiMenuItem();
    bassicMenuItem.id = 3010101;
    bassicMenuItem.name = 'tutorial.service.serviceUsage.bassic';
    bassicMenuItem.icon = '';
    bassicMenuItem.linkId = 301010100;
    bassicMenuItem.parentId = serviceUsageMenuItem.id;
    menuItems.push(bassicMenuItem);

    // 主导航-四级菜单：日志服务
    let loggerMenuItem = new TpiMenuItem();
    loggerMenuItem.id = 301010100;
    loggerMenuItem.name = 'tutorial.service.serviceUsage.bassic.logger';
    loggerMenuItem.icon = '';
    loggerMenuItem.path = '/tutorial-service/service-usage/bassic/logger';
    loggerMenuItem.parentId = bassicMenuItem.id;
    menuItems.push(loggerMenuItem);

    // 主导航-四级菜单：缓存服务
    let cacheMenuItem = new TpiMenuItem();
    cacheMenuItem.id = 301010101;
    cacheMenuItem.name = 'tutorial.service.serviceUsage.bassic.cache';
    cacheMenuItem.icon = '';
    cacheMenuItem.path = '/tutorial-service/service-usage/bassic/cache';
    cacheMenuItem.parentId = bassicMenuItem.id;
    menuItems.push(cacheMenuItem);

    // 主导航-四级菜单：存储服务
    let storageMenuItem = new TpiMenuItem();
    storageMenuItem.id = 301010102;
    storageMenuItem.name = 'tutorial.service.serviceUsage.bassic.storage';
    storageMenuItem.icon = '';
    storageMenuItem.path = '/tutorial-service/service-usage/bassic/storage';
    storageMenuItem.parentId = bassicMenuItem.id;
    menuItems.push(storageMenuItem);

    // 主导航-四级菜单：事件服务
    let eventMenuItem = new TpiMenuItem();
    eventMenuItem.id = 301010103;
    eventMenuItem.name = 'tutorial.service.serviceUsage.bassic.event';
    eventMenuItem.icon = '';
    eventMenuItem.path = '/tutorial-service/service-usage/bassic/event';
    eventMenuItem.parentId = bassicMenuItem.id;
    menuItems.push(eventMenuItem);

    // 主导航-四级菜单：国际化服务
    let i18nMenuItem = new TpiMenuItem();
    i18nMenuItem.id = 301010104;
    i18nMenuItem.name = 'tutorial.service.serviceUsage.bassic.i18n';
    i18nMenuItem.icon = '';
    i18nMenuItem.path = '/tutorial-service/service-usage/bassic/i18n';
    i18nMenuItem.parentId = bassicMenuItem.id;
    menuItems.push(i18nMenuItem);

    // 主导航-四级菜单：主题服务
    let themeMenuItem = new TpiMenuItem();
    themeMenuItem.id = 301010105;
    themeMenuItem.name = 'tutorial.service.serviceUsage.bassic.theme';
    themeMenuItem.icon = '';
    themeMenuItem.path = '/tutorial-service/service-usage/bassic/theme';
    themeMenuItem.parentId = bassicMenuItem.id;
    menuItems.push(themeMenuItem);

    // 主导航-四级菜单：模板接口服务
    let portMenuItem = new TpiMenuItem();
    portMenuItem.id = 301010106;
    portMenuItem.name = 'tutorial.service.serviceUsage.bassic.port';
    portMenuItem.icon = '';
    portMenuItem.path = '/tutorial-service/service-usage/bassic/port';
    portMenuItem.parentId = bassicMenuItem.id;
    menuItems.push(portMenuItem);

    // 主导航-四级菜单：路由服务
    let routerMenuItem = new TpiMenuItem();
    routerMenuItem.id = 301010107;
    routerMenuItem.name = 'tutorial.service.serviceUsage.bassic.router';
    routerMenuItem.icon = '';
    routerMenuItem.path = '/tutorial-service/service-usage/bassic/router';
    routerMenuItem.parentId = bassicMenuItem.id;
    menuItems.push(routerMenuItem);

    // 主导航-四级菜单：权限服务
    let authMenuItem = new TpiMenuItem();
    authMenuItem.id = 301010108;
    authMenuItem.name = 'tutorial.service.serviceUsage.bassic.auth';
    authMenuItem.icon = '';
    authMenuItem.path = '/tutorial-service/service-usage/bassic/auth';
    authMenuItem.parentId = bassicMenuItem.id;
    menuItems.push(authMenuItem);

    return menuItems;
  }
}
