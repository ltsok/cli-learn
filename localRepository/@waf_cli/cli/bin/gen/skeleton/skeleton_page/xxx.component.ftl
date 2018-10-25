import { Component } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * {{page.name}}
 * @export
 * @class {{page.camelName}}Component
 */
@Component({
  templateUrl: './{{page.prefix}}.component.html',
  styleUrls: ['./{{page.prefix}}.component.scss']
})
export class {{page.camelName}}Component {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof {{module.camelName}}Module
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
