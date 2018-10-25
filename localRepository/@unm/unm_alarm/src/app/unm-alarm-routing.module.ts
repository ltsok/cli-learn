import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnmAlarmComponent } from './unm-alarm.component';
import { AlarmCurrentComponent } from './query/alarm-current/alarm-current.component';
import { AlarmHistoryComponent } from './query/alarm-history/alarm-history.component';
import { AlarmDetailComponent } from './query/alarm-current/alarm-detail.component'
import { AlarmInvestigationComponent } from './query/alarm-current/alarm-investigation.component'

// 路由配置
export const routes: Routes = [
  {
    path: 'unm-alarm', component: UnmAlarmComponent,
    children: [
      { path: 'query/alarm-current', component: AlarmCurrentComponent },
      { path: 'query/alarm-history', component: AlarmHistoryComponent },
      { path: 'board/alarm-focal', component: AlarmCurrentComponent },
      { path: 'board/alarm-critical', component: AlarmCurrentComponent },
      { path: 'board/alarm-major', component: AlarmCurrentComponent },
      { path: 'board/alarm-minor', component: AlarmCurrentComponent },
      { path: 'board/alarm-suggestive', component: AlarmCurrentComponent },
      { path: 'view/alarm-detail', component: AlarmDetailComponent },
      { path: 'view/alarm-investigation', component: AlarmInvestigationComponent }
    ]
  }
];

/**
 * unm_alarm路由模块
 * @export
 * @class UnmAlarmRouterModule
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
export class UnmAlarmRouterModule { }
