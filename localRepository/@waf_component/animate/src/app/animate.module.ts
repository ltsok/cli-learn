import { NgModule } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { constant } from './animate.constant';

/**
 * animate动态库引入模块
 * @export
 * @class AnimateModule
 */
@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [],
})
export class AnimateModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof AnimateModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize animate-css lead-module.');
  }
}
