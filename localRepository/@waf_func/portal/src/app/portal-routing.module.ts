import { NgModule, Compiler } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortalComponent } from './portal.component';
import { DefaultComponent } from './default/default.component';
import { CustomComponent } from './custom/custom.component';

// 路由配置
export const routes: Routes = [
  {
    path: 'portal', component: PortalComponent,
    children: [
      { path: 'default', component: DefaultComponent },
      { path: 'custom', component: CustomComponent }
    ]
  }
];


/**
 * portal路由模块
 * @export
 * @class PortalRouterModule
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
export class PortalRouterModule { }
