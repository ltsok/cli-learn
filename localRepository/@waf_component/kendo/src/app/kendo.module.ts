import { NgModule } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { constant } from './kendo.constant';

/**
 * kendo组件库引入模块
 * @export
 * @class KendoModule
 */
@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
  ]
})
export class KendoModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof KendoModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize kendo lead-module.');
  }
}
