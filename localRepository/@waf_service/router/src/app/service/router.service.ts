import { Injectable } from "@angular/core";
import { LoggerService } from '@waf_service/logger';
import { CacheService } from '@waf_service/cache';
import { EventService } from '@waf_service/event';
import { LocalStorageService } from "@waf_service/storage";
import { I18nService } from '@waf_service/i18n';
import { constant } from '../router.constant';
import { Router } from '@angular/router';
import { TpiService, TpiMenuItem } from '@waf_service/tpi';

const ROUTER_KEY: string = "router.param";
const TAB_KEY: string = "router.tab.param";
const DEF_ROUTER_CONFIG: any = {
  skipLocationChange: true
}

/**
 * router服务
 * @export
 * @class RouterService
 */
@Injectable()
export class RouterService {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {Router} router
   * @param {CacheService} cache
   * @param {TpiService} tpi
   * @param {EventService} event
   * @param {LocalStorageService} local
   * @memberof RouterService
   */
  constructor(private logger: LoggerService, private router: Router,
    private cache: CacheService, private tpi: TpiService,
    private event: EventService, private local: LocalStorageService,
    private i18n: I18nService) {

    this.logger.info(constant.identifier, 'Initialize router service.');
  }

  /**
   * 主路由导航
   * @param {string} path
   * @param {*} [param]
   * @param {*} [config]
   * @returns {Promise<boolean>}
   * @memberof RouterService
   */
  navigate(menuItem: TpiMenuItem, config?: any): Promise<boolean> {

    // 根据导航目标确定最终目标
    let dsetMenuItem = this.getDsetMenuItem(menuItem);

    // 没有导航路由，则直接返回
    if (!dsetMenuItem.path) {
      this.logger.debug(constant.identifier, 'The menu-item of ' + menuItem.id + ' has not path.');
      return;
    }

    // 获取导航前信息
    let beforeMenuItemId = this.cache.getCache('menu.object.selected')
    let beforeMenuItem = this.tpi.getMenuItem(beforeMenuItemId);

    this.logger.debug(constant.identifier, beforeMenuItemId + '-' + (menuItem ? menuItem.id:'null') + '-' + dsetMenuItem.id, 'navigate-menu-id');

    // 如果当前是常驻页，则新打开tab页
    if (beforeMenuItem && beforeMenuItem.type.isResidentPage) {

      return new Promise<boolean>((resolve, reject) => {
        this.navigateNewTab(dsetMenuItem).then(
          () => { resolve(false) }
        );
      });

    } else {

      return new Promise<boolean>((resolve, reject) => {

        // 设置路由参数并导航
        this.cache.setCache(ROUTER_KEY, dsetMenuItem.pathParam);
        let routerCfg = DEF_ROUTER_CONFIG;
        if (config) {
          routerCfg = config;
        }

        this.logger.debug(constant.identifier, dsetMenuItem.path, 'navigate-path');
        this.logger.debug(constant.identifier, routerCfg, 'navigate-cfg');
        this.router.navigate([dsetMenuItem.path], routerCfg).then(
          () => {

            // 设置当前选中的主导航项
            this.cache.setCache('menu.object.selected', dsetMenuItem.id);

            // 发布事件:主导航变更
            this.event.publish('event.service.router.navigate', { beforeMenuItemId: beforeMenuItemId, afterMenuItemId: dsetMenuItem.id });

            resolve(true);
          }
        );
      });
    }
  }

  /**
   * 获取最终目标菜单项
   * @private
   * @param {TpiMenuItem} menuItem
   * @returns {TpiMenuItem}
   * @memberof RouterService
   */
  private getDsetMenuItem(menuItem: TpiMenuItem): TpiMenuItem {

    // 如果输入的目标菜单项为空，则设置目标为入口菜单项
    if (!menuItem) {
      return this.tpi.getMainMenuItem();
    }

    // 获取导航链接目标（只做一层）
    let dsetMenuItem = menuItem;
    if (!menuItem.path && menuItem.linkId) {
      dsetMenuItem = this.tpi.getMenuItem(menuItem.linkId);
    }
    dsetMenuItem.pathParam = menuItem.pathParam;
    return dsetMenuItem;
  }

  /**
   * 显示命名路由
   * @param {Array<string>} names
   * @param {*} [param]
   * @param {*} [config]
   * @returns {Promise<boolean>}
   * @memberof RouterService
   */
  showNameRoute(names: Array<string>, param?: any, config?: any): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {

      if (param) {
        this.cache.setCache(ROUTER_KEY, param);
      }

      let outlets = {};
      names.forEach((name: string) => {
        outlets[name] = [name];
      });

      let routerCfg = DEF_ROUTER_CONFIG;
      if (config) {
        routerCfg = config;
      }

      this.router.navigate([{ outlets: outlets }], routerCfg).then(
        () => { resolve(true); }
      );
    });
  }

  /**
   * 隐藏命名路由
   * @param {Array<string>} names
   * @param {*} [param]
   * @param {*} [config]
   * @returns {Promise<boolean>}
   * @memberof RouterService
   */
  hideNameRoute(names: Array<string>): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {

      let outlets = {};
      names.forEach((name: string) => {
        outlets[name] = null;
      });

      this.router.navigate([{ outlets: outlets }], DEF_ROUTER_CONFIG).then(
        () => { resolve(true); }
      );
    });
  }

  /**
   * 打开新的tab页
   * @param {TpiMenuItem} menuItem
   * @returns {Promise<boolean>}
   * @memberof RouterService
   */
  navigateNewTab(menuItem: TpiMenuItem): Promise<boolean> {

    this.logger.debug(constant.identifier, menuItem, 'navigate-new-tab-menu');

    return new Promise<boolean>((resolve, reject) => {

      this.local.setValue(TAB_KEY, {
        id: menuItem.id,
        token: this.cache.getCache("token"),
        server: this.cache.getCache('server.selected'),
        lang: this.i18n.getCurrentLang(),
        param: menuItem.pathParam
      }, true);
      window.open('/main');
      resolve(true);
    });
  }

  /**
   * 获取打开新tab时传递参数
   * @returns {*}
   * @memberof ContextService
   */
  getNewTabParam(): any {
    return this.local.getJsonObj(TAB_KEY, true);
  }

  /**
   * 删除打开新tab时传递参数
   * @memberof ContextService
   */
  removeNewTabParam(): void {
    this.local.remove(TAB_KEY, true);
  }

  /**
   * 当前选中的菜单项
   * @returns {TpiMenuItem}
   * @memberof RouterService
   */
  getCurrentMenuItem(): TpiMenuItem {
    let curMenuItemId = this.cache.getCache('menu.object.selected');
    return this.tpi.getMenuItem(curMenuItemId);
  }

  /**
   * 获取面包屑
   * @returns {Array<TpiMenuItem>}
   * @memberof RouterService
   */
  getBreadcrumb(): Array<TpiMenuItem> {

    let breadcrumb = [];
    let curMenuItem = this.getCurrentMenuItem();

    if (curMenuItem && !curMenuItem.type.isSpecial) {
      this.tidyBreadcrumb(curMenuItem, breadcrumb);
      this.logger.debug(constant.identifier, breadcrumb, 'breadcrumb');
      return breadcrumb.reverse();
    } else {
      return breadcrumb;
    }
  }

  /**
   * 面包屑信息整理
   * @private
   * @param {TpiMenuItem} menuItem
   * @param {Array<TpiMenuItem>} breadcrumb
   * @memberof RouterService
   */
  private tidyBreadcrumb(menuItem: TpiMenuItem, breadcrumb: Array<TpiMenuItem>) {

    breadcrumb.push(menuItem);
    if (!menuItem.type.isRoot) {
      this.tidyBreadcrumb(this.tpi.getMenuItem(menuItem.parentId), breadcrumb);
    }
  }
}
