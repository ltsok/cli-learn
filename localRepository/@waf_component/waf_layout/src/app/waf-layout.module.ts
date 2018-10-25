import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './waf-layout.constant';
import { WafLayoutComponent } from './waf-layout.component';

export { WafLayoutItemModel } from './model/waf-layout.model';
export { WafLayoutComponent } from './waf-layout.component';

import { NgZorroAntdModule } from 'ng-zorro-antd';

/**
 * waf_layout模块
 * @export
 * @class WafLayoutModule
 */
@NgModule({
  declarations: [
    WafLayoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule
  ],
  exports: [
    WafLayoutComponent
  ],
  providers: [
  ]
})
export class WafLayoutModule {
  /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof WafLayoutModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize waf_layout module.');
  }
}
