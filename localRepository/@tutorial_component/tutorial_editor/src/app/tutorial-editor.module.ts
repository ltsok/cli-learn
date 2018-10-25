import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { TransModule } from '@waf_service/i18n';
import { constant } from './tutorial-editor.constant';
import { TutorialEditorComponent } from './tutorial-editor.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

export { TutorialEditorModel } from './model/tutorial-editor.model';

/**
 * tutorial_editor模块
 * @export
 * @class TutorialEditorModule
 */
@NgModule({
  declarations: [
    TutorialEditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TransModule,
    NgZorroAntdModule
  ],
  exports: [
    TutorialEditorComponent
  ],
  providers: [
  ]
})
export class TutorialEditorModule {
  /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof TutorialEditorModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize tutorial_editor module.');
  }
 }
