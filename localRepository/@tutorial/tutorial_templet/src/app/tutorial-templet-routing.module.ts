import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorialTempletComponent } from './tutorial-templet.component';
import {TempletThoughtComponent} from "./templet-design/templet-thought/templet-thought.component";
import {TempletClassicComponent} from "./templet-web/templet-classic/templet-classic.component";
import {TempletUnmComponent} from "./templet-web/templet-unm/templet-unm.component";

// 路由配置
export const routes: Routes = [
  {
    path: 'tutorial-templet', component: TutorialTempletComponent,
    children: [
      { path:'templet-design/templet-thought',component: TempletThoughtComponent },
      { path:'templet-web/templet-classic',component: TempletClassicComponent },
      { path:'templet-web/templet-unm',component: TempletUnmComponent }
    ]
  }
];

/**
 * tutorial_templet路由模块
 * @export
 * @class TutorialTempletRouterModule
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
export class TutorialTempletRouterModule { }
