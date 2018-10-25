import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './tutorial-func.constant';
import { TutorialFuncRouterModule } from './tutorial-func-routing.module';
import { TutorialFuncComponent } from './tutorial-func.component';
import { TutorialFuncMenuService } from './service/tutorial-func-menu.service';
import { FuncThoughtComponent } from "./func-design/func-thought/func-thought.component";
import { PortalIntroduceComponent } from "./func-portal/portal-introduce/portal-introduce.component";
import { ColumnLayoutComponent } from "./func-portal/auto-layout/column-layout/column-layout.component";
import { RowLayoutComponent } from "./func-portal/auto-layout/row-layout/row-layout.component";
import { SameSizeLayoutComponent } from "./func-portal/auto-layout/same-size-layout/same-size-layout.component";
import { TempletLayoutComponent } from "./func-portal/templet-layout/templet-layout.component";
import { TutorialFuncDataBoardService } from "./service/tutorial-func-data-board.service";
import { TutorialFuncQuickEntryService } from "./service/tutorial-func-quick-entry.service";

/**
 * tutorial_func模块
 * @export
 * @class TutorialFuncModule
 */
@NgModule({
  declarations: [
    TutorialFuncComponent,
    FuncThoughtComponent,
    PortalIntroduceComponent,
    ColumnLayoutComponent,
    RowLayoutComponent,
    SameSizeLayoutComponent,
    TempletLayoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TutorialFuncRouterModule
  ],
  providers: [
    { provide: 'tpi.menu', useClass: TutorialFuncMenuService, multi: true },
    { provide: 'func.databoard', useClass: TutorialFuncDataBoardService, multi: true },
    { provide: 'func.quickentry', useClass: TutorialFuncQuickEntryService, multi: true }
  ]
})
export class TutorialFuncModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof TutorialFuncModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize tutorial_func module.');
  }
}
