import { NgModule } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { constant } from './event.constant';
import { EventService } from './service/event.service';
export { EventService } from './service/event.service';

/**
 * event模块
 * @export
 * @class EventModule
 */
@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
    { provide: EventService, useClass: EventService }
  ]
})
export class EventModule {

/**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof EventModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize event module.');
  }
}
