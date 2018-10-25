import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './{{module.prefix}}.constant';
import { {{module.camelName}}RouterModule } from './{{module.prefix}}-routing.module';
import { {{module.camelName}}Component } from './{{module.prefix}}.component';
import { DefaultComponent } from './default/default.component';
import { {{module.camelName}}MenuService } from './service/{{module.prefix}}-menu.service';

/**
 * {{module.name}}模块
 * @export
 * @class {{module.camelName}}Module
 */
@NgModule({
  declarations: [
    {{module.camelName}}Component,
    DefaultComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    {{module.camelName}}RouterModule
  ],
  providers: [
    { provide: 'tpi.menu', useClass: {{module.camelName}}MenuService, multi: true }
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
