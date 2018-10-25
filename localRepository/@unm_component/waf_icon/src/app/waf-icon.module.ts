import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './waf-icon.constant';
import { WafIconComponent } from './waf-icon.component';
export { WafIconModel } from './model/waf-icon.model';

/**
 * waf_icon模块
 * @export
 * @class WafIconModule
 */
@NgModule({
  declarations: [
    WafIconComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    WafIconComponent
  ],
  providers: [
  ]
})
export class WafIconModule {
  /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof WafIconModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize waf_icon module.');
  }
}
