import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './waf-tag.constant';
import { WafTagComponent } from './waf-tag.component';

export { WafTagItemModel } from './model/waf-tag.model';
export { WafTagComponent } from './waf-tag.component';

import { NgZorroAntdModule } from 'ng-zorro-antd';

/**
 * waf_tag模块
 * @export
 * @class WafTagModule
 */
@NgModule({
  declarations: [
    WafTagComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule
  ],
  exports: [
    WafTagComponent
  ],
  providers: [
  ]
})
export class WafTagModule {
  /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof WafTagModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize waf_tag module.');
  }
}
