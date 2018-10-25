import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnmLoggerComponent } from './unm-logger.component';
import { LoggerU2kComponent } from './query/logger-u2k/logger-u2k.component';

// 路由配置
export const routes: Routes = [
  {
    path: 'unm-logger', component: UnmLoggerComponent,
    children: [
      { path: 'query/logger-u2k', component: LoggerU2kComponent}
    ]
  }
];

/**
 * unm_logger路由模块
 * @export
 * @class UnmLoggerRouterModule
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
export class UnmLoggerRouterModule { }
