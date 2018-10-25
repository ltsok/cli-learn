import { Component } from '@angular/core';
import { constant } from '../../unm-report.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * report-environment
 * @export
 * @class ReportEnvironmentComponent
 */
@Component({
  templateUrl: './report-environment.component.html',
  styleUrls: ['./report-environment.component.scss']
})
export class ReportEnvironmentComponent {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof UnmReportModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
