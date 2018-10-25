import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorialPracticeComponent } from './tutorial-practice.component';
import {PracticeThoughtComponent} from "./practice-design/practice-thought/practice-thought.component";
import {SystemWebComponent} from "./practice-example/system-web/system-web.component";

// 路由配置
export const routes: Routes = [
  {
    path: 'tutorial-practice', component: TutorialPracticeComponent,
    children: [
      { path:'practice-design/practice-thought', component: PracticeThoughtComponent, },
      { path:'practice-example/system-web',component: SystemWebComponent }
    ]
  }
];

/**
 * tutorial_practice路由模块
 * @export
 * @class TutorialPracticeRouterModule
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
export class TutorialPracticeRouterModule { }
