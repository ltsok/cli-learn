import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

// 路由配置
export const routes: Routes = [
  {
    path: 'tutorial-start', component: TutorialStartComponent,
    children: [
      { path: 'preparation/environment', component: EnvironmentComponent},
      { path: 'preparation/common-commands', component: CommonCommandsComponent},
      { path: 'preparation/common-problems', component: CommonProblemsComponent},
      { path: 'specification/folder', component: FolderComponent},
      { path: 'specification/name', component: NameComponent},
      { path: 'specification/code', component: CodeComponent},
      { path: 'extension/resource/ext-i18n', component: ExtI18nComponent},
      { path: 'extension/resource/ext-iconfont', component: ExtIconfontComponent},
      { path: 'extension/resource/ext-module', component: ExtModuleComponent},
      { path: 'extension/module', component: ModuleComponent},
      { path: 'extension/page', component: PageComponent},
      { path: 'extension/global-style', component: GlobalStyleComponent},
      { path: 'extension/third-party', component: ThirdPartyComponent}
    ]
  }
];

/**
 * tutorial_start路由模块
 * @export
 * @class TutorialStartRouterModule
 */
@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class TutorialStartRouterModule { }
