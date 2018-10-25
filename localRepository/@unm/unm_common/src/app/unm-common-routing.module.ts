import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnmCommonComponent } from './unm-common.component';


// 路由配置
export const routes: Routes = [
  {
    path: 'unm-common', component: UnmCommonComponent,
    children: [
    ]
  }
];

/**
 * unm_common路由模块
 * @export
 * @class UnmCommonRouterModule
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
export class UnmCommonRouterModule { }
