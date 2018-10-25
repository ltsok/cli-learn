import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnmPmComponent } from './unm-pm.component';
import { PmCurrentComponent } from './query/pm-current/pm-current.component';
import { PmHistoryComponent } from './query/pm-history/pm-history.component';
import { PmTemplateComponent } from './query/pm-template/pm-template.component';
import { PmTendencyComponent } from './analysis/pm-tendency/pm-tendency.component';

// 路由配置
export const routes: Routes = [
  {
    path: 'unm-pm', component: UnmPmComponent,
    children: [
      { path: 'query/pm-current', component: PmCurrentComponent },
      { path: 'query/pm-history', component: PmHistoryComponent },
      { path: 'query/pm-template', component: PmTemplateComponent },
      { path: 'analysis/pm-tendency', component: PmTendencyComponent }
    ]
  }
];

/**
 * unm_pm路由模块
 * @export
 * @class UnmPmRouterModule
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
export class UnmPmRouterModule { }
