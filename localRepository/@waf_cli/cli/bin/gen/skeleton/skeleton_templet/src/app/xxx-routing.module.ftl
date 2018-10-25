import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { {{module.camelName}}Component } from './{{module.prefix}}.component';

// 路由配置
export const routes: Routes = [
  { path: '{{module.prefix}}', component: {{module.camelName}}Component, outlet: '{{module.prefix}}' }
];

/**
 * {{module.name}}路由模块
 * @export
 * @class {{module.camelName}}RouterModule
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
export class {{module.camelName}}RouterModule { }
