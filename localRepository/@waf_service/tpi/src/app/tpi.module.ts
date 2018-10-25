import { NgModule } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { constant } from './tpi.constant';
import { TpiService } from './service/tpi.service';
import { TpiGlobalService } from './service/tpi-global.service';
import { DummyLoginService } from './tpi-login/tpi-login.service';
import { DummyMenuService } from './tpi-menu/tpi-menu.service';
export { ITpiGlobal } from './tpi-global/tpi-global.interface';
export { ITpiLogin } from './tpi-login/tpi-login.interface';
export { TpiLoginInput, TpiLoginOutput, LoginInfo } from './tpi-login/tpi-login.model';
export { ITpiMenu } from './tpi-menu/tpi-menu.interface';
export { TpiMenuItem, TpiMenuItemType } from './tpi-menu/tpi-menu.model';
export { TpiService } from './service/tpi.service';
export { TpiGlobalService } from './service/tpi-global.service';

/**
 * tpi模块
 * @export
 * @class TpiModule
 */
@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
    TpiService,
    TpiGlobalService,
    { provide: 'tpi.login', useClass: DummyLoginService },
    { provide: 'tpi.menu', useClass: DummyMenuService, multi: true }
  ]
})
export class TpiModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof TpiModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize tpi module.');
  }
}
