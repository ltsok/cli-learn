import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './tutorial-practice.constant';
import { TutorialPracticeRouterModule } from './tutorial-practice-routing.module';
import { TutorialPracticeComponent } from './tutorial-practice.component';
import { TutorialPracticeMenuService } from './service/tutorial-practice-menu.service';
import {PracticeThoughtComponent} from "./practice-design/practice-thought/practice-thought.component";
import {SystemWebComponent} from "./practice-example/system-web/system-web.component";
import {SystemMobileComponent} from "./practice-example/system-mobile/system-mobile.component";

/**
 * tutorial_practice模块
 * @export
 * @class TutorialPracticeModule
 */
@NgModule({
  declarations: [
    TutorialPracticeComponent,
    PracticeThoughtComponent,
    SystemWebComponent,
    SystemMobileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TutorialPracticeRouterModule
  ],
  providers: [
    { provide: 'tpi.menu', useClass: TutorialPracticeMenuService, multi: true }
  ]
})
export class TutorialPracticeModule {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof TutorialPracticeModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize tutorial_practice module.');
  }
}
