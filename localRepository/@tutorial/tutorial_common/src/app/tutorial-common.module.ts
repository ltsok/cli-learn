import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './tutorial-common.constant';
import { TutorialLoginService } from './service/tutorial-common-login.service';

/**
 * tutorial_common模块
 * @export
 * @class TutorialCommonModule
 */
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    { provide: 'tpi.login', useClass: TutorialLoginService,}
  ]
})
export class TutorialCommonModule {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof TutorialCommonModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize tutorial_common module.');
  }
}
