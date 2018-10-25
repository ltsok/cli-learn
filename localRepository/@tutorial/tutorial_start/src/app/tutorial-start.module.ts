import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { TransModule } from '@waf_service/i18n';
import { constant } from './tutorial-start.constant';
import { TutorialStartRouterModule } from './tutorial-start-routing.module';
import { TutorialStartComponent } from './tutorial-start.component';
import { EnvironmentComponent } from './preparation/environment/environment.component';
import { CommonCommandsComponent } from './preparation/common-commands/common-commands.component';
import { CommonProblemsComponent } from './preparation/common-problems/common-problems.component';
import { FolderComponent } from './specification/folder/folder.component';
import { NameComponent } from './specification/name/name.component';
import { CodeComponent } from './specification/code/code.component';
import { ExtI18nComponent } from './extension/resource/ext-i18n/ext-i18n.component';
import { ExtIconfontComponent } from './extension/resource/ext-iconfont/ext-iconfont.component';
import { ExtModuleComponent } from './extension/resource/ext-module/ext-module.component';
import { ModuleComponent } from './extension/module/module.component';
import { PageComponent } from './extension/page/page.component';
import { GlobalStyleComponent } from './extension/global-style/global-style.component';
import { ThirdPartyComponent } from './extension/third-party/third-party.component';
import { TutorialStartMenuService } from './service/tutorial-start-menu.service';
import { TutorialEditorModule} from '@tutorial_component/tutorial_editor';

/**
 * 入门教程模块
 * @export
 * @class TutorialStartModule
 */
@NgModule({
  declarations: [
    TutorialStartComponent,
    EnvironmentComponent,
    CommonCommandsComponent,
    CommonProblemsComponent,
    FolderComponent,
    NameComponent,
    CodeComponent,
    ExtI18nComponent,
    ExtIconfontComponent,
    ExtModuleComponent,
    ModuleComponent,
    PageComponent,
    GlobalStyleComponent,
    ThirdPartyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TutorialStartRouterModule,
    TutorialEditorModule,
    TransModule
  ],
  providers: [
    { provide: 'tpi.menu', useClass: TutorialStartMenuService, multi: true }
  ]
})
export class TutorialStartModule {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof TutorialStartModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize tutorial_start module.');
  }
}
