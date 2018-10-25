import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './{{module.prefix}}.constant';
import { {{module.camelName}}Component } from './{{module.prefix}}.component';

export { {{module.camelName}}Model } from './model/{{module.prefix}}.model';

/**
 * {{module.name}}控件模块
 * @export
 * @class {{module.camelName}}Module
 */
@NgModule({
  declarations: [
    {{module.camelName}}Component
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    {{module.camelName}}Component
  ],
  providers: [
  ]
})
export class {{module.camelName}}Module {
  /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof {{module.camelName}}Module
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize {{module.name}} module.');
  }
 }
