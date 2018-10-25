import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnmNeManagerComponent } from './unm-ne-manager.component';
import { NeBoxComponent } from "./ne-box/ne-box.component";
import { AlarmCurrentComponent } from "../../../unm_alarm/src/app/query/alarm-current/alarm-current.component";
// 路由配置
export const routes: Routes = [
  {
    path: 'unm-ne-manager', component: UnmNeManagerComponent,
    children: [
      { path: 'box', component: NeBoxComponent },
      // { path: 'alarm', component: AlarmCurrentComponent },
      // { path: 'performance', component: NeBoxComponent },
      // { path: 'old-performance', component: NeBoxComponent },
    ]
  }
];

/**
 * unm_ne_manager路由模块
 * @export
 * @class UnmNeManagerRouterModule
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
export class UnmNeManagerRouterModule { }
