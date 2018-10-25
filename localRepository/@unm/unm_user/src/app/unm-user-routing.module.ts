import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnmUserComponent } from './unm-user.component';
import { UserInfoComponent } from './query/user-info/user-info.component';

// 路由配置
export const routes: Routes = [
  {
    path: 'unm-user', component: UnmUserComponent,
    children: [
      { path: 'query/user-info', component: UserInfoComponent}
    ]
  }
];

/**
 * unm_user路由模块
 * @export
 * @class UnmUserRouterModule
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
export class UnmUserRouterModule { }
