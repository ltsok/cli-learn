import { Component } from '@angular/core';
import { constant } from '../../unm-report.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * report-optical-power
 * @export
 * @class ReportOpticalPowerComponent
 */
@Component({
  templateUrl: './report-optical-power.component.html',
  styleUrls: ['./report-optical-power.component.scss']
})
export class ReportOpticalPowerComponent {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof UnmReportModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
