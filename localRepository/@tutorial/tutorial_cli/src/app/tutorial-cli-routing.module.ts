import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorialCliComponent } from './tutorial-cli.component';
import {CliThoughtComponent} from "./cli-design/cli-thought/cli-thought.component";
import {CliBuildComponent} from "./cli-usage/cli-build-file/cli-build/cli-build.component";
import {CliPublishComponent} from "./cli-usage/cli-build-file/cli-publish/cli-publish.component";
import {CliServeComponent} from "./cli-usage/cli-build-file/cli-serve/cli-serve.component";
import {CliUnpublishComponent} from "./cli-usage/cli-build-file/cli-unpublish/cli-unpublish.component";
import {CliInitComponent} from "./cli-usage/cli-environment/cli-init/cli-init.component";
import {CliInstallComponent} from "./cli-usage/cli-environment/cli-install/cli-install.component";
import {CliLsComponent} from "./cli-usage/cli-environment/cli-ls/cli-ls.component";
import {CliReinitComponent} from "./cli-usage/cli-environment/cli-reinit/cli-reinit.component";
import {CliUpdateComponent} from "./cli-usage/cli-environment/cli-update/cli-update.component";
import {CliUpgradeComponent} from "./cli-usage/cli-environment/cli-upgrade/cli-upgrade.component";
import {CliNewComponent} from "./cli-usage/cli-skeleton/cli-new/cli-new.component";
import {CliPageComponent} from "./cli-usage/cli-skeleton/cli-page/cli-page.component";

// 路由配置
export const routes: Routes = [
  {
    path: 'tutorial-cli', component: TutorialCliComponent,
    children: [
      { path:'cli-design/cli-thought',component: CliThoughtComponent },
      { path:'cli-usage/cli-build-file/cli-build',component: CliBuildComponent },
      { path:'cli-usage/cli-build-file/cli-publish',component: CliPublishComponent },
      { path:'cli-usage/cli-build-file/cli-serve',component: CliServeComponent },
      { path:'cli-usage/cli-build-file/cli-unpublish',component: CliUnpublishComponent },
      { path:'cli-usage/cli-environment/cli-init',component: CliInitComponent },
      { path:'cli-usage/cli-environment/cli-install',component: CliInstallComponent },
      { path:'cli-usage/cli-environment/cli-ls',component: CliLsComponent },
      { path:'cli-usage/cli-environment/cli-reinit',component: CliReinitComponent },
      { path:'cli-usage/cli-environment/cli-update',component: CliUpdateComponent },
      { path:'cli-usage/cli-environment/cli-upgrade',component: CliUpgradeComponent },
      { path:'cli-usage/cli-skeleton/cli-new',component: CliNewComponent },
      { path:'cli-usage/cli-skeleton/cli-page',component: CliPageComponent}
    ]
  }
];

/**
 * tutorial_cli路由模块
 * @export
 * @class TutorialCliRouterModule
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
export class TutorialCliRouterModule { }
