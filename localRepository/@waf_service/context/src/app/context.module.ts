import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationStart } from '@angular/router';
import { LoggerService } from '@waf_service/logger';
import { PushService } from '@waf_service/push';
import { constant } from './context.constant';
import { ContextService } from './service/context.service';
import { LocalStorageService } from "@waf_service/storage";
import { CacheService } from "@waf_service/cache";
import { I18nService } from "@waf_service/i18n";
import { CanDeactivateGuard } from './service/can-deactivate-guard.service';
import * as $ from "jquery";
export { ContextService } from './service/context.service';
export { CanDeactivateGuard, CanComponentDeactivate } from './service/can-deactivate-guard.service';

declare const require;

/**
 * 上下文模块
 * @export
 * @class ContextModule
 */
@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
    { provide: CanDeactivateGuard, useClass: CanDeactivateGuard },
    { provide: ContextService, useClass: ContextService }
  ]
})
export class ContextModule {

  /**
   * 构造函数
   * @param {Router} router
   * @param {LoggerService} logger
   * @param {LocalStorageService} local
   * @param {ContextService} context
   * @param {Title} title
   * @param {CacheService} cache
   * @param {I18nService} i18n
   * @memberof ContextModule
   */
  constructor(private router: Router, private logger: LoggerService, private pushService: PushService,
    private local: LocalStorageService, private context: ContextService,
    private title: Title, private cache: CacheService,
    private i18n: I18nService) {

    // 初始化前端系统配置
    this.initSysCfg();

    // 初始化应用设置
    this.initAppSettings();

    // 打印日志
    this.logger.info(constant.identifier, 'Initialize context module.');
  }

  /**
   * 初始化前端系统配置
   * @private
   * @memberof ContextModule
   */
  private initSysCfg() {

    // 设置同步
    $.ajaxSettings.async = false;

    $.ajax({
      url: "assets/config.ini",
      type: "GET",
      dataType: "text",
      success: (iniContent) => {

        // 读取前端外部全局配置
        const Processor = require('conf-cfg-ini')
        let iniProcessor = new Processor();
        iniProcessor.options.lineEnding = iniProcessor.detectLineEnding(iniContent);

        let iniObj = iniProcessor.decode(iniContent);
        let servers = iniObj.servers['servers'].split(',');
        this.local.setValue('servers', servers, true);
        servers.forEach(server => {
          this.local.setValue(server, iniObj[server], true);
        });
      },
      error: (request, textStatus) => {
        this.logger.error(constant.identifier, request.status, "reading config.ini status");
        this.logger.error(constant.identifier, textStatus, "reading config.ini error info.");
      }
    });

    // 还原：设置异步
    $.ajaxSettings.async = true;
  }

  /**
   * 初始化应用设置
   * @private
   * @memberof ContextModule
   */
  private initAppSettings() {

    // 设置应用title
    this.context.getI18n('app.title').subscribe((result: string) => {
      this.title.setTitle(result);
    });
  }
}
