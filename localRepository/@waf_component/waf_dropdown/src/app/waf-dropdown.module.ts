import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './waf-dropdown.constant';
import { WafDropdownComponent } from './waf-dropdown.component';

export { WafDropdownItemModel } from './model/waf-dropdown.model';
export { WafDropdownComponent } from './waf-dropdown.component';

import { NgZorroAntdModule } from 'ng-zorro-antd';

/**
 * waf-dropdown模块
 * @export
 * @class WafDropdownModule
 */
@NgModule({
  declarations: [
    WafDropdownComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule
  ],
  exports: [
    WafDropdownComponent
  ],
  providers: [
  ]
})
export class WafDropdownModule {
  /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof WafDropdownModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize waf_dropdown module.');
  }
}
