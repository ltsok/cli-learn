import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LoggerService } from '@waf_service/logger';
import { EventService } from '@waf_service/event';
import { CacheService } from '@waf_service/cache';
import { I18nService } from '@waf_service/i18n';
import { RouterService } from '@waf_service/router';
import { TpiService, TpiGlobalService, LoginInfo, TpiMenuItem } from '@waf_service/tpi';
import { LocalStorageService } from "@waf_service/storage";
import { constant } from '../context.constant';

const ROUTER_KEY: string = "router.param";

/**
 * 上下文服务
 * @export
 * @class ContextService
 */
@Injectable()
export class ContextService {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {CacheService} cache
   * @param {LocalStorageService} local
   * @param {EventService} event
   * @param {I18nService} i18n
   * @param {RouterService} router
   * @param {TpiService} tpi
   * @param {TpiGlobalService} tpiGlobal
   * @memberof ContextService
   */
  constructor(private logger: LoggerService, private cache: CacheService, private local: LocalStorageService,
    private event: EventService, private i18n: I18nService, private router: RouterService,
    private tpi: TpiService, private tpiGlobal: TpiGlobalService) {

    this.logger.info(constant.identifier, "Initialize context service.");
  }

  /**
   * 设置路由参数
   * @param {*} param
   * @returns {void}
   * @memberof ContextService
   */
  setRouterParam(param: any): void {
    return this.cache.setCache(ROUTER_KEY, param);
  }

  /**
   * 获取路由参数
   * @returns {*}
   * @memberof ContextService
   */
  getRouterParam(): any {
    return this.cache.getCache(ROUTER_KEY);
  }

  /**
   * 获取缓存数据
   * @param {string} key
   * @returns {*}
   * @memberof ContextService
   */
  getCache(key: string): any {
    return this.cache.getCache(key);
  }

  /**
   * 获取登录信息
   * @returns {LoginInfo}
   * @memberof ContextService
   */
  getLoginInfo(): LoginInfo {
    return this.local.getJsonObj("login.info");
  }

  /**
   * 获取用户级配置
   * @param {string} key
   * @param {string} [def]
   * @returns {string}
   * @memberof ContextService
   */
  getUserCfg(key: string, def?: string): string {

    // 用户级配置
    let value = this.local.getValue(key);

    // 用户级配置不存在取系统级配置
    if (!value) {
      value = this.local.getValue(key, true);
    }

    // 用户级配置和系统级配置都不存在，取默认值
    if (!value) {
      value = def;
    }
    return value;
  }

  /**
   * 获取系统级配置
   * @param {string} key
   * @param {string} [def]
   * @returns {string}
   * @memberof ContextService
   */
  getSysCfg(key: string, def?: string): string {

    // 系统级配置
    let value = this.local.getValue(key, true);
    if (!value) {
      value = def;
    }
    return value;
  }

  /**
   * 订购某事件主题
   * @param {string} topic
   * @param {(...args: any[]) => Promise<string>} handler
   * @memberof ContextService
   */
  subscribe(topic: string, handler: (...args: any[]) => Promise<string>): void {
    this.event.subscribe(topic, handler);
  }

  /**
   * 取消订购某事件主题
   * @param {string} topic
   * @memberof ContextService
   */
  unsubscribe(topic: string): void {
    this.event.unsubscribe(topic);
  }

  /**
   * 发布事件
   * @param {string} topic
   * @param {*} [arg]
   * @returns {Promise<any>}
   * @memberof ContextService
   */
  publish(topic: string, arg?: any): Promise<any> {
    return this.event.publish(topic, arg);
  }

  /**
   * 获取当前应用语言类型
   * @returns {string}
   * @memberof ContextService
   */
  getCurrentLang(): string {
    return this.i18n.getCurrentLang();
  }

  /**
   * 根据key值获取国际化后的字符串
   * @param {string} key
   * @returns {Observable<string>}
   * @memberof ContextService
   */
  getI18n(key: string): Observable<string> {
    return this.i18n.get(key);
  }
  /**
   * 导航功能器
   * @param {TpiMenuItem} menuItem
   * @param {*} [config]
   * @returns {Promise<boolean>}
   * @memberof ContextService
   */
  navigate(menuItem: TpiMenuItem, config?: any): Promise<boolean> {
    return this.router.navigate(menuItem, config);
  }

  /**
   * 导航到新tab页
   * @param {TpiMenuItem} menuItem
   * @returns {Promise<boolean>}
   * @memberof ContextService
   */
  navigateNewTab(menuItem: TpiMenuItem): Promise<boolean> {
    return this.router.navigateNewTab(menuItem);
  }

  /**
   * 退出登录
   * @memberof ContextService
   */
  logout():void{
    this.tpi.logout();
  }

  /**
   * 设置监控信息
   * @param info
   * @memberof ContextService
   */
  setSupervisoryInfo(numInfo: Map<number, number>, flashInfo: Map<number, boolean>): void {
    this.tpi.setSupervisoryInfo({ svNumInfo: numInfo, svFlashInfo: flashInfo });
  }

  /**
  * 显示页面级Loading框
  * @memberof ContextService
  */
  showLoading(): void {
    this.tpiGlobal.getGlobalService().showLoading();
  }

  /**
   * 隐藏页面级Loading框
   * @memberof ContextService
   */
  hideLoading(): void {
    this.tpiGlobal.getGlobalService().hideLoading();
  }

  /**
   * 弹出确认框
   * @param {string} msgKey
   * @param {() => void} accept
   * @param {() => void} [reject]
   * @memberof ContextService
   */
  confirmDialog(msgKey: string, accept: () => void, reject?: () => void): void {
    this.tpiGlobal.getGlobalService().confirmDialog(msgKey, accept, reject);
  }

  /**
   * 弹出警告框
   * @param {string} msgKey
   * @memberof ContextService
   */
  warnDialog(msgKey: string): void {
    this.tpiGlobal.getGlobalService().warnDialog(msgKey);
  }

  /**
   * 弹出错误框
   * @param {string} msgKey
   * @memberof ContextService
   */
  errorDialog(msgKey: string): void {
    this.tpiGlobal.getGlobalService().errorDialog(msgKey);
  }

  /**
   * 弹出成功框
   * @param {string} msgKey
   * @param {() => void} [callback]
   * @param {boolean} [auto]
   * @param {number} [delay]
   * @memberof ContextService
   */
  successDialog(msgKey: string, callback?: () => void, auto?: boolean, delay?: number): void {
    this.tpiGlobal.getGlobalService().successDialog(msgKey, callback, auto, delay);
  }
}
