import { NgModule } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { constant } from './push.constant';
import { PushService } from './service/push.service';
export { PushService } from './service/push.service';

/**
 * push模块
 * @export
 * @class PushModule
 */
@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
    { provide: PushService, useClass: PushService }
  ]
})
export class PushModule {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof PushModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize push module.');
  }
}
