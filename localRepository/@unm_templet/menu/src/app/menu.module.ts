import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { constant } from './menu.constant';
import { MenuRouterModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';
import { LoggerService } from '@waf_service/logger';
import { TransModule } from '@waf_service/i18n';
import { ContextService } from '@waf_service/context';
import { RouterService } from '@waf_service/router';
import { TpiService, TpiMenuItem } from '@waf_service/tpi';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import * as $ from "jquery";
export { MenuVModelItem } from './model/menu.model';
export { MenuComponent } from './menu.component';

/**
 * 菜单模块
 * @export
 * @class MenuModule
 */
@NgModule({
  declarations: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    MenuRouterModule,
    TransModule,
    NgZorroAntdModule
  ],
  providers: [

  ]
})
export class MenuModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof MenuModule
   */
  constructor(private logger: LoggerService, private router: RouterService,
    private context: ContextService, protected tpi: TpiService) {

    this.logger.info(constant.identifier, 'Initialize menu module.');

    // 订阅主路由变更事件
    this.context.subscribe("event.service.router.navigate", (event) => {
      return new Promise((resolve, reject) => {

        // 获取当前面包屑
        let breadcrumb = this.router.getBreadcrumb();

        // 主导航上的变更
        // 如果点击的以及导航有直接关联的路由，则关闭子导航
        if ((breadcrumb.length === 1)
          && (this.tpi.getMenuChildren(event.afterMenuItemId).length <= 0)) {
          this.closeSubMenu();
        }

        // 如果点击的三级导航下有子导航菜单，则打开子导航，否则关闭子导航
        if (breadcrumb.length === 3) {
          if (this.tpi.getMenuChildren(event.afterMenuItemId).length > 0) {
            this.openSubMenu(event.afterMenuItemId);
          } else {
            this.closeSubMenu();
          }
        }

        // 子导航上的变更
        if (breadcrumb.length > 3) {
          this.openSubMenu(breadcrumb[2].id, event.afterMenuItemId);
        }

        resolve();
      });
    });
  }

  /**
   * 打开子导航菜单
   * @private
   * @param {number} subMenuItemParentId
   * @param {number} [destMenuItemId]
   * @memberof MenuModule
   */
  private openSubMenu(subMenuItemParentId: number, destMenuItemId?: number): void {

    setTimeout(() => {
      $("#domain-submenu").show();
      $(".menu-breadcrumb .left").show();
      this.router.showNameRoute(['submenu'], { subMenuItemParentId: subMenuItemParentId, destMenuItemId: destMenuItemId });
    }, 1);
  }

  /**
   * 关闭子导航菜单
   * @private
   * @memberof MenuModule
   */
  private closeSubMenu(): void {
    $("#domain-submenu").hide();
    $(".menu-breadcrumb .left").hide();
    this.router.hideNameRoute(['submenu']);
  }
}
