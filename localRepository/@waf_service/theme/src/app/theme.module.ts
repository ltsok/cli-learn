import { NgModule, ModuleWithProviders } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { constant } from './theme.constant';
import { ThemeService } from './service/theme.service';
export { ThemeService } from './service/theme.service';

/**
 * theme模块
 * @export
 * @class ThemeModule
 */
@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [{ provide: ThemeService, useClass: ThemeService }]
})
export class ThemeModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof ThemeModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize theme module.');
  }
}
