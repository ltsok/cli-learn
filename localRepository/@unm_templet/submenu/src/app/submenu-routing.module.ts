import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubmenuComponent } from './submenu.component';

// 路由配置
export const routes: Routes = [
  { path: 'submenu', component: SubmenuComponent, outlet: 'submenu' }
];

/**
 * submenu路由模块
 * @export
 * @class SubmenuRouterModule
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
export class SubmenuRouterModule { }
