import { Component } from '@angular/core';
import { constant } from '../../unm-pm.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * pm-template
 * @export
 * @class PmTemplateComponent
 */
@Component({
  templateUrl: './pm-template.component.html',
  styleUrls: ['./pm-template.component.scss']
})
export class PmTemplateComponent {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof UnmPmModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
