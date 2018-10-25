import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './tutorial-templet.constant';
import { TutorialTempletRouterModule } from './tutorial-templet-routing.module';
import { TutorialTempletComponent } from './tutorial-templet.component';
import { TutorialTempletMenuService } from './service/tutorial-templet-menu.service';
import {TempletClassicComponent} from "./templet-web/templet-classic/templet-classic.component";
import {TempletUnmComponent} from "./templet-web/templet-unm/templet-unm.component";
import {TempletThoughtComponent} from "./templet-design/templet-thought/templet-thought.component";

/**
 * tutorial_templet模块
 * @export
 * @class TutorialTempletModule
 */
@NgModule({
  declarations: [
    TutorialTempletComponent,
    TempletClassicComponent,
    TempletUnmComponent,
    TempletThoughtComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TutorialTempletRouterModule
  ],
  providers: [
    { provide: 'tpi.menu', useClass: TutorialTempletMenuService, multi: true }
  ]
})
export class TutorialTempletModule {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof TutorialTempletModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize tutorial_templet module.');
  }
}
