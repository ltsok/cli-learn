import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { TransModule } from '@waf_service/i18n';
import { TreeSelecterModule } from "@unm_component/tree_selecter";
import { constant } from './unm-pm.constant';
import { UnmPmRouterModule } from './unm-pm-routing.module';
import { UnmPmComponent } from './unm-pm.component';
import { PmCurrentComponent } from './query/pm-current/pm-current.component';
import { PmConditionsComponent } from './query/pm-conditions/pm-conditions.component';
import { PmTableComponent } from './query/pm-table/pm-table.component';
import { PmHistoryComponent } from './query/pm-history/pm-history.component';
import { PmTemplateComponent } from './query/pm-template/pm-template.component';
import { PmTendencyComponent } from './analysis/pm-tendency/pm-tendency.component';
import { UnmPmMenuService } from './service/unm-pm-menu.service';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { GridModule } from '@progress/kendo-angular-grid';
/**
 * unm_pm模块
 * @export
 * @class UnmPmModule
 */
@NgModule({
  declarations: [
    UnmPmComponent,
    PmCurrentComponent,
    PmHistoryComponent,
    PmTemplateComponent,
    PmTendencyComponent,
    PmConditionsComponent,
    PmTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UnmPmRouterModule,
    NgZorroAntdModule,
    TransModule,
    GridModule,
    TreeSelecterModule
  ],
  providers: [
    { provide: 'tpi.menu', useClass: UnmPmMenuService, multi: true }
  ]
})
export class UnmPmModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof UnmPmModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize unm_pm module.');
  }
}
