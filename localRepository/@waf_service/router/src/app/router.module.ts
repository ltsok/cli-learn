import { NgModule } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { CacheService } from "@waf_service/cache";
import { I18nService } from "@waf_service/i18n";
import { EventService } from '@waf_service/event';
import { TpiService, TpiMenuItem } from '@waf_service/tpi';
import { constant } from './router.constant';
import { Router, NavigationStart } from '@angular/router';
import { RouterService } from './service/router.service';
export { RouterService } from './service/router.service';

/**
 * router模块
 * @export
 * @class RouterModule
 */
@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
    { provide: RouterService, useClass: RouterService }
  ]
})
export class RouterModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof RouterModule
   */
  constructor(private logger: LoggerService, private router: Router,
    private routerService: RouterService, private cache: CacheService,
    private i18n: I18nService, private event: EventService, private tpi: TpiService) {

    this.logger.info(constant.identifier, 'Initialize router module.');

    // 监听路由跳转事件
    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationStart) {

          // 如果新页传递参数中的url和当前监听的url一致，则认为是新打开的页
          let tabParam = this.routerService.getNewTabParam();
          if (tabParam) {
            let curMenuItem = this.tpi.getMenuItem(tabParam.id);
            if (event.url === '/main') {

              this.logger.debug(constant.identifier, curMenuItem, "new-tab-menu");
              this.logger.debug(constant.identifier, tabParam, "new-tab-param");

              // 处理传递到新页的参数
              this.cache.setCache("token", tabParam.token);
              this.cache.setCache("server.selected", tabParam.server);
              this.i18n.changeLang(tabParam.lang);

              // 主导航变更
              this.routerService.navigate(curMenuItem, tabParam.param);

              // 发布新tab页事件
              this.event.publish('event.service.router.new.tab', { menuId: curMenuItem.id });
            }
          }
          this.routerService.removeNewTabParam();
        }
      });
  }
}
