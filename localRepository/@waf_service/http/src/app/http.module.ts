import { NgModule } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { constant } from './http.constant';
import * as NgHttp from '@angular/http';
import { HttpService } from './service/http.service';
export { HttpService } from './service/http.service';
export { MSG, RequestMsg, ResponseMsg } from './service/http.service.smodel';

/**
 * http模块
 * @export
 * @class HttpModule
 */
@NgModule({
  declarations: [
  ],
  imports: [
    NgHttp.HttpModule
  ],
  providers: [
    { provide: HttpService, useClass: HttpService }
  ]
})
export class HttpModule {

  /**
    * 构造函数
    * @param {LoggerService} logger
    * @memberof HttpModule
    */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize http module.');
  }
}
