import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './unm-common.constant';
import { UnmCommonRouterModule } from './unm-common-routing.module';
import { UnmCommonComponent } from './unm-common.component';
import { UnmCommonQuickEntryService } from './service/unm-common-quick-entry.service'
import { BuildStationComponent } from './portal/quick-entry/build-station.component';
import { NetworkCheckComponent } from './portal/quick-entry/network-check.component';
import { WeeklyReportComponent } from './portal/quick-entry/weekly-report.component';


/**
 * unm_common模块
 * @export
 * @class UnmCommonModule
 */
@NgModule({
  declarations: [
    UnmCommonComponent,
    BuildStationComponent,
    NetworkCheckComponent,
    WeeklyReportComponent
  ],
  entryComponents: [
    BuildStationComponent,
    NetworkCheckComponent,
    WeeklyReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UnmCommonRouterModule
  ],
  providers: [
    { provide: 'func.quickentry', useClass: UnmCommonQuickEntryService, multi: true }

  ]
})
export class UnmCommonModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof UnmCommonModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize unm_common module.');
  }
}
