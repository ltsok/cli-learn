import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { TransModule } from '@waf_service/i18n';
import { constant } from './global.constant';
import { GlobalService } from './service/global.service';
import { GlobalComponent } from './global.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

export { GlobalService } from './service/global.service';
export { GlobalComponent } from './global.component';

/**
 * global模块
 * @export
 * @class GlobalModule
 */
@NgModule({
  declarations: [
    GlobalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TransModule,
    NgZorroAntdModule
  ],
  providers: [
    { provide: 'tpi.global', useClass: GlobalService }
  ],
  exports: [
    GlobalComponent
  ]
})
export class GlobalModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof GlobalModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize global module.');
  }
}
