import { Component } from '@angular/core';
import { constant } from '../../unm-pm.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * pm-tendency
 * @export
 * @class PmTendencyComponent
 */
@Component({
  templateUrl: './pm-tendency.component.html',
  styleUrls: ['./pm-tendency.component.scss']
})
export class PmTendencyComponent {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof UnmPmModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
