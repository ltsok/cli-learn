import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { constant } from './tree-selecter.constant';
import { TreeSelecterComponent } from './tree-selecter.component';

export { TreeSelecterModel } from './model/tree-selecter.model';
export {TreeSelecterComponent} from './tree-selecter.component';

/**
 * tree_selecter模块
 * @export
 * @class Tree_selecterModule
 */
@NgModule({
  declarations: [
    TreeSelecterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule
  ],
  exports: [
    TreeSelecterComponent
  ],
  providers: [
  ]
})
export class TreeSelecterModule {
  /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof TreeSelecterModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize treeSelecter module.');
  }
}
