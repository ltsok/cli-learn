import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './waf-dragdrop.constant';
import { DragdropComponent, DItem, DragService } from './dragdrop/dragdrop.component';
import { WafDragdropComponent } from './waf-dragdrop.component';
export { DragdropComponent, DItem } from './dragdrop/dragdrop.component';
export { WafDragdropComponent } from './waf-dragdrop.component';

import { NgZorroAntdModule } from 'ng-zorro-antd';

/**
 * waf_dragdrop模块
 * @export
 * @class WafDragdropModule
 */
@NgModule({
  declarations: [
    DragdropComponent,
    DItem,
    WafDragdropComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule
  ],
  exports: [
    DragdropComponent,
    DItem,
    WafDragdropComponent
  ],
  providers: [
    DragService
  ]
})
export class WafDragdropModule {
  /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof WafDragdropModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize waf_dragdrop module.');
  }
}
