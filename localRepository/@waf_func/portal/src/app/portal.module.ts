import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './portal.constant';
import { PortalRouterModule } from './portal-routing.module';
import { PortalComponent } from './portal.component';
import { DefaultComponent } from './default/default.component';
import { CustomComponent } from './custom/custom.component';
import { PortalMenuService } from './service/portal-menu.service';

import { WafLayoutModule } from '@waf_component/waf_layout';
import { WafDragdropModule } from '@waf_component/waf_dragdrop';


export { IDataBoard } from './interface/data-board.interface';
export { IQuickEntry } from './interface/quick-entry.interface';
export { DataBoardItem } from './interface/data-board.model';
export { QuickEntryItem } from './interface/quick-entry.model';

/**
 * 主页模块
 * @export
 * @class PortalModule
 */
@NgModule({
  declarations: [
    PortalComponent,
    DefaultComponent,
    CustomComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PortalRouterModule,
    WafLayoutModule,
    WafDragdropModule
  ],
  providers: [
    { provide: 'tpi.menu', useClass: PortalMenuService, multi: true }
  ]
})
export class PortalModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof PortalModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize PortalComponent module.');
  }
}
