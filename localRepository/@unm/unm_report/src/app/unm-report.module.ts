import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { TransModule } from '@waf_service/i18n';
import { constant } from './unm-report.constant';
import { UnmReportRouterModule } from './unm-report-routing.module';
import { UnmReportComponent } from './unm-report.component';
import { ReportDistributionComponent } from './resources/report-distribution/report-distribution.component';
import { ReportNeComponent } from './resources/report-ne/report-ne.component';
import { ReportShelfComponent } from './resources/report-shelf/report-shelf.component';
import { ReportSlotComponent } from './resources/report-slot/report-slot.component';
import { ReportBoardComponent } from './resources/report-board/report-board.component';
import { ReportPortComponent } from './resources/report-port/report-port.component';
import { ReportOpticalModuleComponent } from './resources/report-optical-module/report-optical-module.component';
import { Report15mPmComponent } from './pm/report-15m-pm/report-15m-pm.component';
import { ReportOpticalPowerComponent } from './pm/report-optical-power/report-optical-power.component';
import { ReportErrorRateComponent } from './pm/report-error-rate/report-error-rate.component';
import { ReportEnvironmentComponent } from './pm/report-environment/report-environment.component';
import { ReportHardwareComponent } from './pm/report-hardware/report-hardware.component';
import { ReportCustomComponent } from './report-custom/report-custom.component';
import { UnmReportMenuService } from './service/unm-report-menu.service';

import { EchartsModule } from '@waf_component/echarts'
import { WafDropdownModule } from '@waf_component/waf_dropdown';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

import { ReportDistributionChartCardComponent } from './resources/report-distribution/report-distribution-chart-card.component';
import { ReportTableComponent } from './resources/report-table/report-table.component';
/**
 * unm_report模块
 * @export
 * @class UnmReportModule
 */
@NgModule({
  declarations: [
    UnmReportComponent,
    ReportDistributionComponent,
    ReportNeComponent,
    ReportShelfComponent,
    ReportSlotComponent,
    ReportBoardComponent,
    ReportPortComponent,
    ReportOpticalModuleComponent,
    Report15mPmComponent,
    ReportOpticalPowerComponent,
    ReportErrorRateComponent,
    ReportEnvironmentComponent,
    ReportHardwareComponent,
    ReportCustomComponent,
    ReportDistributionChartCardComponent,
    ReportTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TransModule,
    UnmReportRouterModule,
    EchartsModule,
    NgZorroAntdModule,
    GridModule,
    WafDropdownModule,
    ButtonsModule
  ],
  providers: [
    { provide: 'tpi.menu', useClass: UnmReportMenuService, multi: true }
  ]
})
export class UnmReportModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof UnmReportModule
   */
  constructor(private logger: LoggerService, private context: ContextService) {
    this.logger.info(constant.identifier, 'Initialize unm_report module.');
  }
}
