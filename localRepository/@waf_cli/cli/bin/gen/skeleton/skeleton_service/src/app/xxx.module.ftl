import { NgModule } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { constant } from './{{module.prefix}}.constant';

import { {{module.camelName}}Service } from './service/{{module.prefix}}.service';
export { {{module.camelName}}Service } from './service/{{module.prefix}}.service';

/**
 * {{module.name}}服务模块
 * @export
 * @class {{module.camelName}}Module
 */
@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
    { provide: {{module.camelName}}Service, useClass: {{module.camelName}}Service }
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
