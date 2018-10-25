import { NgModule } from '@angular/core';
import { constant } from './logger.constant';
import { LoggerService } from './service/logger.service';
export { LoggerService } from './service/logger.service';

/**
 * 日志模块：提供日志打印服务
 * @export
 * @class LoggerModule
 */
@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [{ provide: LoggerService, useClass: LoggerService }]
})
export class LoggerModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof LoggerModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize logger module.');
  }
}
