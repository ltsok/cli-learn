import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnmSettingsComponent } from './unm-settings.component';
import { SettingsUserComponent } from './individual/settings-user/settings-user.component';
import { SettingsAlarmComponent } from './individual/settings-alarm/settings-alarm.component';

// 路由配置
export const routes: Routes = [
  {
    path: 'unm-settings', component: UnmSettingsComponent,
    children: [
      { path: 'individual/settings-user', component: SettingsUserComponent },
      { path: 'individual/settings-alarm', component: SettingsAlarmComponent }
    ]
  }
];

/**
 * unm_settings路由模块
 * @export
 * @class UnmSettingsRouterModule
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
export class UnmSettingsRouterModule { }
