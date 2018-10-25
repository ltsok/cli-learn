import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './tutorial-service.constant';
import { TutorialServiceRouterModule } from './tutorial-service-routing.module';
import { TutorialServiceComponent } from './tutorial-service.component';
import { TutorialServiceMenuService } from './service/tutorial-service-menu.service';
import {ServiceThoughtComponent} from "./service-design/service-thought/service-thought.component";
import {ContextComponent} from "./service-usage/apply/context/context.component";
import {HttpComponent} from "./service-usage/apply/http/http.component";
import {PushComponent} from "./service-usage/apply/push/push.component";
import {AuthComponent} from "./service-usage/bassic/auth/auth.component";
import {CacheComponent} from "./service-usage/bassic/cache/cache.component";
import {EventComponent} from "./service-usage/bassic/event/event.component";
import {I18nComponent} from "./service-usage/bassic/i18n/i18n.component";
import {LoggerComponent} from "./service-usage/bassic/logger/logger.component";
import {PortComponent} from "./service-usage/bassic/port/port.component";
import {RouterComponent} from "./service-usage/bassic/router/router.component";
import {StorageComponent} from "./service-usage/bassic/storage/storage.component";
import {ThemeComponent} from "./service-usage/bassic/theme/theme.component";

import { TutorialEditorModule } from '@tutorial_component/tutorial_editor';
/**
 * tutorial_service模块
 * @export
 * @class TutorialServiceModule
 */
@NgModule({
  declarations: [
    TutorialServiceComponent,
    ServiceThoughtComponent,
    ContextComponent,
    HttpComponent,
    PushComponent,
    AuthComponent,
    CacheComponent,
    EventComponent,
    I18nComponent,
    LoggerComponent,
    PortComponent,
    RouterComponent,
    StorageComponent,
    ThemeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TutorialServiceRouterModule,
    TutorialEditorModule
  ],
  providers: [
    { provide: 'tpi.menu', useClass: TutorialServiceMenuService, multi: true }
  ]
})
export class TutorialServiceModule {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof TutorialServiceModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize tutorial_service module.');
  }
}
