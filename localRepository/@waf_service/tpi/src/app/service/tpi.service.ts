import { Injectable, Inject } from "@angular/core";
import { constant } from '../tpi.constant';
import { LoggerService } from "@waf_service/logger";
import { CacheService } from "@waf_service/cache";
import { I18nService } from "@waf_service/i18n";
import { EventService } from "@waf_service/event";
import { LocalStorageService } from "@waf_service/storage";
import { ITpiLogin } from '../tpi-login/tpi-login.interface';
import { TpiLoginInput, TpiLoginOutput, LoginInfo } from '../tpi-login/tpi-login.model';
import { ITpiMenu } from '../tpi-menu/tpi-menu.interface';
import { TpiMenuItem, TpiMenuItemType } from '../tpi-menu/tpi-menu.model';
import { Menu } from './tpi.service.smodel';

/**
 * 模板编程接口服务
 * @export
 * @class TpiService
 */
@Injectable()
export class TpiService {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {CacheService} cache
   * @param {I18nService} i18n
   * @param {EventService} event
   * @param {LocalStorageService} local
   * @param {ITpiLogin} loginService
   * @param {ITpiMenu[]} menuServices
   * @memberof TpiService
   */
  constructor(private logger: LoggerService, private cache: CacheService, private i18n: I18nService,
    private event: EventService, private local: LocalStorageService,
    @Inject('tpi.login') private loginService: ITpiLogin,
    @Inject('tpi.menu') private menuServices: ITpiMenu[]) {

    this.logger.info(constant.identifier, 'Initialize tpi service.');
  }

  /**
   *初始化菜单对象
   * @private
   * @memberof TpiService
   */
  private initMenu() {

    // 初始化菜单对象
    let menu: Menu = new Menu();

    // 初始化特殊菜单
    // 入口菜单项
    let mainMenuItem = new TpiMenuItem();
    mainMenuItem.id = constant.mainMenuItemId;
    mainMenuItem.path = '/main';
    mainMenuItem.type.isSpecial = true;
    menu.index.set(constant.mainMenuItemId, mainMenuItem);

    // 初始化导航菜单
    this.menuServices.forEach((menuService: ITpiMenu) => {
      let menuItems = menuService.getMenuItems();
      if (menuItems) {
        menuItems.forEach((menuItem: TpiMenuItem) => {

          // 1.基本校验：菜单项ID和菜单项名必须指定
          if (!menuItem.id || !menuItem.name) {
            throw new Error('The id/name of menu-item must be specified.');
          }

          // 1.基本校验：菜单项ID必须大于0
          if (menuItem.id < 0 || (menuItem.parentId && menuItem.parentId < 0 && menuItem.parentId !== -99)) {
            throw new Error('The id of menu-item cannot be less than 0.');
          }

          // 2.属性设置：设置菜单项类型中的冗余属性
          menuItem.type.isRoot = menuItem.parentId ? false : true;

          // 3.构造菜单对象：设置索引
          menu.index.set(menuItem.id, menuItem);

          // 4.构造菜单对象：设置菜单项父子关系
          let parentId = menuItem.parentId ? menuItem.parentId : -1;
          if (undefined == menu.relation.get(parentId)) {

            let children: number[] = [menuItem.id];
            menu.relation.set(parentId, children);

          } else {

            let children: number[] = menu.relation.get(parentId);
            children.push(menuItem.id);
            menu.relation.set(parentId, children);
          }
        });
      }
    });

    // 3.构造菜单对象：更新到缓存中
    this.cache.setCache('menu.object', menu);

    this.logger.debug(constant.identifier, menu, 'menu');
  }

  /**
   * 登录
   * @param {TpiLoginInput} input
   * @param {() => void} success
   * @param {(desc: string) => void} fail
   * @memberof TpiService
   */
  login(input: TpiLoginInput, success: () => void, fail: (desc: string) => void): void {

    // 执行具体登录逻辑
    this.loginService.login(input).then(

      (output: TpiLoginOutput) => {

        // 基本校验：必须有登录token
        if (output.token) {
          this.cache.setCache('token', output.token);
        } else {
          throw new Error('The unique token of logged-in user must be specified.');
        }

        // 基本校验：必须有登录用户的基本信息
        if (!output.user) {
          throw new Error('The basic information of logged-in user must be specified.');
        }

        // 初始化菜单对象
        this.initMenu();

        // 发布登录成功的事件
        this.event.publish('event.service.tpi.login.success.start', { loginInput: input, loginOutput: output }).then(
          () => {

            // 判断LocalStorage当前大小
            // 长度大于2M：系统自动清除
            let size = 0;
            for (let item in window.localStorage) {
              if (window.localStorage.hasOwnProperty(item)) {
                size += window.localStorage.getItem(item).length;
              }
            }
            // 2*1024*1024 = 2097152
            if (size > 2097152) {
              this.logger.info(constant.identifier, 'clear user localstorage(B):' + size);
              this.local.clearUser();
            }

            // 存储登录信息
            let loginInfo = new LoginInfo();
            loginInfo.isLogin = true;
            loginInfo.user = output.user;
            this.local.setValue("login.info", loginInfo);

            // 存储用户级配置
            output.userCfg.forEach((value: string, key: string) => {
              this.local.setValue(key, value);
            });

            // 存储系统级配置
            output.sysCfg.forEach((value: string, key: string) => {
              this.local.setValue(key, value, true);
            });

            success();
          },
          (desc: string) => {
            this.logger.error(constant.identifier, "The event of login-success-start is failed.");
            fail(desc);
          }
        );
      },
      (desc: string) => { fail(desc) }
    );
  }

  /**
   * 退出登录
   * @memberof TpiService
   */
  logout(): void {

    // 退出登录
    this.loginService.logout().then(
      () => { this.logger.info(constant.identifier, 'logout') },
      (desc: string) => { this.logger.error(constant.identifier, desc) }
    );

    // 清理localstorage和cache
    this.local.clearCur();
    this.cache.clear();

    // 发布注销事件
    this.event.publish('event.service.tpi.logout');
  }

  /**
   * 菜单直接子菜单
   * @param {number} parentId
   * @returns {TpiMenuItem[]}
   * @memberof TpiService
   */
  getMenuChildren(parentId: number): TpiMenuItem[] {

    let menu: Menu = this.getMenu();
    let children: TpiMenuItem[] = [];

    let childrenIds = menu.relation.get(parentId);
    if (childrenIds) {
      childrenIds.forEach(childId => {
        children.push(this.getMenuItem(childId));
      });
    }
    return children;
  }

  /**
   * 获取对应Id的菜单项
   * @param {number} id
   * @returns {TpiMenuItem}
   * @memberof TpiService
   */
  getMenuItem(id: number): TpiMenuItem {

    let menu: Menu = this.getMenu();
    return menu.index.get(id);
  }

  /**
   * 更新路由参数
   * @param {number} id
   * @param {*} pathParam
   * @memberof TpiService
   */
  updatePathParam(id: number, pathParam: any): void {

    // 存在则更新，不存在则不操作
    let menu: Menu = this.getMenu();
    let menuItem = menu.index.get(id);
    if (menuItem) {
      menuItem.pathParam = pathParam;
      menu.index.set(id, menuItem);
    }
  }

  /**
   * 获取入口菜单项（特殊菜单项）
   */
  getMainMenuItem(): TpiMenuItem {
    return this.getMenuItem(constant.mainMenuItemId);
  }

  /**
   * 获取根菜单项
   * @returns {TpiMenuItem[]}
   * @memberof TpiService
   */
  getRootMenuItems(): TpiMenuItem[] {

    let menu: Menu = this.getMenu();
    let rootMenuItems: TpiMenuItem[] = [];
    menu.index.forEach((menuItem: TpiMenuItem) => {
      if (menuItem.type.isRoot) {
        rootMenuItems.push(menuItem);
      }
    });
    return rootMenuItems.sort((a, b) => { return a.id - b.id });
  }

  /**
   * 获取快捷菜单项
   * @returns {TpiMenuItem[]}
   * @memberof TpiService
   */
  getShortcutMenuItems(): TpiMenuItem[] {

    let menu: Menu = this.getMenu();
    let shortcutMenuItems: TpiMenuItem[] = [];
    menu.index.forEach((menuItem: TpiMenuItem) => {
      if (menuItem.type.isShortcut) {
        shortcutMenuItems.push(menuItem);
      }
    });
    return shortcutMenuItems.sort((a, b) => { return a.id - b.id });
  }

  /**
   * 获取监控菜单项
   * @returns {TpiMenuItem[]}
   * @memberof TpiService
   */
  getSupervisoryMenuItems(): TpiMenuItem[] {

    let menu: Menu = this.getMenu();
    let supervisoryMenuItems: TpiMenuItem[] = [];
    menu.index.forEach((menuItem: TpiMenuItem) => {
      if (menuItem.type.isSupervisory) {
        supervisoryMenuItems.push(menuItem);
      }
    });
    return supervisoryMenuItems.sort((a, b) => { return a.id - b.id });
  }

  /**
   * 设置监控信息
   * @param {*} info
   * @memberof TpiService
   */
  setSupervisoryInfo(info: any): void {
    this.event.publish('event.service.tpi.shortcut.supervisory', info);
  }

  /**
   * 获取菜单对象
   * @private
   * @returns {Menu}
   * @memberof TpiService
   */
  private getMenu(): Menu {

    let menu: Menu = this.cache.getCache('menu.object');
    if (!menu) {
      this.initMenu();
      return this.cache.getCache('menu.object');
    }
    return menu;
  }
}
