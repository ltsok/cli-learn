import { Component } from '@angular/core';
import { constant } from '../../unm-report.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * report-hardware
 * @export
 * @class ReportHardwareComponent
 */
@Component({
  templateUrl: './report-hardware.component.html',
  styleUrls: ['./report-hardware.component.scss']
})
export class ReportHardwareComponent {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof UnmReportModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
