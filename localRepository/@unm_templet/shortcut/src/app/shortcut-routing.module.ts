import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShortcutComponent } from './shortcut.component';

// 路由配置
export const routes: Routes = [
  { path: 'shortcut', component: ShortcutComponent, outlet: 'shortcut' }
];

/**
 * shortcut路由模块
 * @export
 * @class ShortcutRouterModule
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
export class ShortcutRouterModule { }
