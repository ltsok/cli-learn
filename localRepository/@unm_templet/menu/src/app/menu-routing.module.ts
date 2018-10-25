import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu.component';

// 路由配置
export const routes: Routes = [
  { path: 'menu', component: MenuComponent, outlet: 'menu' }
];

/**
 * 菜单模块对应的路由模块
 * @export
 * @class MenuRouterModule
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
export class MenuRouterModule { }
