import { Component } from '@angular/core';
import { constant } from '../../unm-report.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * report-error-rate
 * @export
 * @class ReportErrorRateComponent
 */
@Component({
  templateUrl: './report-error-rate.component.html',
  styleUrls: ['./report-error-rate.component.scss']
})
export class ReportErrorRateComponent {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof UnmReportModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
