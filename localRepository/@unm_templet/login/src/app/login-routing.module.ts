import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { DefaultComponent } from './default/default.component';

// 路由配置
export const routes: Routes = [
  { path: 'main', component: LoginComponent  },
  { path: 'login', component: DefaultComponent , outlet: 'login' }
];

/**
 * 登录模块对应的路由模块
 * @export
 * @class LoginRouterModule
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
export class LoginRouterModule { }
