import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { constant } from './login.constant';
import { LoginComponent } from './login.component';
import { DefaultComponent } from './default/default.component';
import { LoginRouterModule } from './login-routing.module';
import { TransModule } from '@waf_service/i18n';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from '@waf_service/context';
import { RouterService } from '@waf_service/router';
import * as $ from "jquery";
import { NgZorroAntdModule } from 'ng-zorro-antd';

/**
 * 登录模块
 * @export
 * @class LoginModule
 */
@NgModule({
  declarations: [
    LoginComponent,
    DefaultComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LoginRouterModule,
    TransModule,
    NgZorroAntdModule
  ],
  providers: []
})
export class LoginModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {ContextService} context
   * @param {Router} router
   * @memberof LoginModule
   */
  constructor(private logger: LoggerService, private context: ContextService, private router: RouterService) {

    this.context.subscribe('event.service.router.new.tab', () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          $("#login").hide();
          $("#menu").show();
          $("#shortcut").show();
          $("#domain").show();
          this.router.showNameRoute(['menu', 'shortcut']);
          resolve();
        }, 1);
      });
    });

    this.logger.info(constant.identifier, 'Initialize login module.');
  }
}
