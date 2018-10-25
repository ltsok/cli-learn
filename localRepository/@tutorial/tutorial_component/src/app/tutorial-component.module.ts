import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { TransModule } from '@waf_service/i18n';
import { constant } from './tutorial-component.constant';
import { TutorialComponentRouterModule } from './tutorial-component-routing.module';
import { TutorialComponentMenuService } from './service/tutorial-component-menu.service';
import { TutorialComponentComponent } from './tutorial-component.component';
import { EchartsModule } from '@waf_component/echarts';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import {ComponentThoughtComponent} from "./component-design/component-thought/component-thought.component";
import {LayoutComponent} from "./component-usage/self-innovate/basic-component/layout/layout.component";
import {OverlayIconComponent} from "./component-usage/self-innovate/basic-component/overlay-icon/overlay-icon.component";
import {AnimateComponent} from "./component-usage/third-party/animate/animate.component";
import {EchartsComponent} from "./component-usage/third-party/echarts/echarts.component";
import {KenDoComponent} from "./component-usage/third-party/KenDo/KenDo.component";
import {NgZorroComponent} from "./component-usage/third-party/ng-zorro/ng-zorro.component";
import {ZtreeComponent} from "./component-usage/third-party/ztree/ztree.component";
import {SelectObjectComponent} from "./component-usage/self-innovate/common-component/select-object/select-object.component";


/**
 * tutorial_component模块
 * @export
 * @class TutorialComponentModule
 */
@NgModule({
  declarations: [
    TutorialComponentComponent,
    ComponentThoughtComponent,
    LayoutComponent,
    OverlayIconComponent,
    AnimateComponent,
    EchartsComponent,
    KenDoComponent,
    NgZorroComponent,
    ZtreeComponent,
    SelectObjectComponent
  ],
  entryComponents: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    TutorialComponentRouterModule,
    TransModule,
    EchartsModule,
    NgZorroAntdModule
  ],
  providers: [
    { provide: 'tpi.menu', useClass: TutorialComponentMenuService, multi: true }
  ]
})
export class TutorialComponentModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof TutorialComponentModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize tutorial_component module.');
  }
}
