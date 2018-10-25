import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './tutorial-cli.constant';
import { TutorialCliRouterModule } from './tutorial-cli-routing.module';
import { TutorialCliComponent } from './tutorial-cli.component';
import { TutorialCliMenuService } from './service/tutorial-cli-menu.service';
import { EchartsModule } from '@waf_component/echarts'
import { WafDragdropModule } from '@waf_component/waf_dragdrop'
import {CliThoughtComponent} from "./cli-design/cli-thought/cli-thought.component";
import {CliBuildComponent} from "./cli-usage/cli-build-file/cli-build/cli-build.component";
import {CliInitComponent} from "./cli-usage/cli-environment/cli-init/cli-init.component";
import {CliInstallComponent} from "./cli-usage/cli-environment/cli-install/cli-install.component";
import {CliLsComponent} from "./cli-usage/cli-environment/cli-ls/cli-ls.component";
import {CliNewComponent} from "./cli-usage/cli-skeleton/cli-new/cli-new.component";
import {CliPageComponent} from "./cli-usage/cli-skeleton/cli-page/cli-page.component";
import {CliPublishComponent} from "./cli-usage/cli-build-file/cli-publish/cli-publish.component";
import {CliReinitComponent} from "./cli-usage/cli-environment/cli-reinit/cli-reinit.component";
import {CliServeComponent} from "./cli-usage/cli-build-file/cli-serve/cli-serve.component";
import {CliUnpublishComponent} from "./cli-usage/cli-build-file/cli-unpublish/cli-unpublish.component";
import {CliUpdateComponent} from "./cli-usage/cli-environment/cli-update/cli-update.component";
import {CliUpgradeComponent} from "./cli-usage/cli-environment/cli-upgrade/cli-upgrade.component";


/**
 * tutorial_cli模块
 * @export
 * @class TutorialCliModule
 */
@NgModule({
  declarations: [
    TutorialCliComponent,
    CliThoughtComponent,
    CliBuildComponent,
    CliInitComponent,
    CliInstallComponent,
    CliLsComponent,
    CliNewComponent,
    CliPageComponent,
    CliPublishComponent,
    CliReinitComponent,
    CliServeComponent,
    CliUnpublishComponent,
    CliUpdateComponent,
    CliUpgradeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TutorialCliRouterModule,
    EchartsModule,
    WafDragdropModule
  ],
  providers: [
    { provide: 'tpi.menu', useClass: TutorialCliMenuService, multi: true }
  ]

})
export class TutorialCliModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof TutorialCliModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize tutorial_cli module.');
  }
}
