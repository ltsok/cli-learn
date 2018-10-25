import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

// 路由配置
export const routes: Routes = [
  {
    path: 'unm-report', component: UnmReportComponent,
    children: [
      { path: 'resources/report-distribution', component: ReportDistributionComponent },
      { path: 'resources/report-ne', component: ReportNeComponent },
      { path: 'resources/report-shelf', component: ReportShelfComponent },
      { path: 'resources/report-slot', component: ReportSlotComponent },
      { path: 'resources/report-board', component: ReportBoardComponent },
      { path: 'resources/report-port', component: ReportPortComponent },
      { path: 'resources/report-optical-module', component: ReportOpticalModuleComponent },
      { path: 'pm/report-15m-pm', component: Report15mPmComponent },
      { path: 'pm/report-optical-power', component: ReportOpticalPowerComponent },
      { path: 'pm/report-error-rate', component: ReportErrorRateComponent },
      { path: 'pm/report-environment', component: ReportEnvironmentComponent },
      { path: 'pm/report-hardware', component: ReportHardwareComponent },
      { path: 'report-custom', component: ReportCustomComponent }
    ]
  }
];

/**
 * unm_report路由模块
 * @export
 * @class UnmReportRouterModule
 */
@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class UnmReportRouterModule { }
