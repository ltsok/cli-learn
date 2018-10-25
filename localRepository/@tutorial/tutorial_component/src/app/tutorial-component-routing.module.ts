import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorialComponentComponent } from './tutorial-component.component';
import {ComponentThoughtComponent} from "./component-design/component-thought/component-thought.component";
import {LayoutComponent} from "./component-usage/self-innovate/basic-component/layout/layout.component";
import {OverlayIconComponent} from "./component-usage/self-innovate/basic-component/overlay-icon/overlay-icon.component";
import {AnimateComponent} from "./component-usage/third-party/animate/animate.component";
import {EchartsComponent} from "./component-usage/third-party/echarts/echarts.component";
import {KenDoComponent} from "./component-usage/third-party/KenDo/KenDo.component";
import {NgZorroComponent} from "./component-usage/third-party/ng-zorro/ng-zorro.component";
import {ZtreeComponent} from "./component-usage/third-party/ztree/ztree.component";
import {SelectObjectComponent} from "./component-usage/self-innovate/common-component/select-object/select-object.component";

// 路由配置
export const routes: Routes = [
  {
    path: 'tutorial-component', component: TutorialComponentComponent,
    children: [
      { path:'component-design/component-thought',component: ComponentThoughtComponent },
      { path:'component-usage/self-innovate/basic-component/layout',component: LayoutComponent },
      { path:'component-usage/self-innovate/basic-component/overlay-icon',component: OverlayIconComponent },
      { path:'component-usage/third-party/animate',component: AnimateComponent },
      { path:'component-usage/third-party/echarts',component: EchartsComponent },
      { path:'component-usage/third-party/KenDo',component: KenDoComponent },
      { path:'component-usage/third-party/ng-zorro',component: NgZorroComponent },
      { path:'component-usage/third-party/ztree',component: ZtreeComponent },
      { path:'component-usage/self-innovate/common-component/select-object',component: SelectObjectComponent }
    ]
  }
];

/**
 * tutorial_component路由模块
 * @export
 * @class TutorialComponentRouterModule
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
export class TutorialComponentRouterModule { }
