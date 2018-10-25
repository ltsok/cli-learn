import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WafDataTableComponent } from './waf-datatable.component';
import { WafDataTableToolbarComponent } from './waf-datatable-toolbar.component';

import { constant } from './waf-datatable.constant';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TransModule } from '@waf_service/i18n';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export * from './waf-datatable.component';
export * from './waf-datatable-toolbar.component';

/**
 * waf-datatable模块
 * @export
 * @class WafDataTableComponent
 */

@NgModule({
  declarations: [
    WafDataTableComponent,
    WafDataTableToolbarComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    TransModule,
    GridModule,
    ButtonsModule,
    ReactiveFormsModule,
    NgZorroAntdModule
  ],
  exports: [
    WafDataTableComponent,
    WafDataTableToolbarComponent
  ],
  providers: [
  ]
})
export class WafDatatableModule {
  /**
   * Creates an instance of WafDatatableModule.
   * @param {LoggerService} logger
   * @memberof WafDataTableComponent
   */
  constructor() {
  }
}
