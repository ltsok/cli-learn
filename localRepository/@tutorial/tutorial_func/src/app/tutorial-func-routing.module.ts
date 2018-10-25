import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorialFuncComponent } from './tutorial-func.component';
import {FuncThoughtComponent} from "./func-design/func-thought/func-thought.component";
import {PortalIntroduceComponent} from "./func-portal/portal-introduce/portal-introduce.component";
import {ColumnLayoutComponent} from "./func-portal/auto-layout/column-layout/column-layout.component";
import {RowLayoutComponent} from "./func-portal/auto-layout/row-layout/row-layout.component";
import {SameSizeLayoutComponent} from "./func-portal/auto-layout/same-size-layout/same-size-layout.component";
import {TempletLayoutComponent} from "./func-portal/templet-layout/templet-layout.component";

// 路由配置
export const routes: Routes = [
  {
    path: 'tutorial-func', component: TutorialFuncComponent,
    children: [
      { path: 'func-design/func-thought',component: FuncThoughtComponent  },
      { path:'func-portal/portal-introduce',component: PortalIntroduceComponent },
      { path:'func-portal/auto-layout/column-layout',component: ColumnLayoutComponent },
      { path:'func-portal/auto-layout/row-layout',component: RowLayoutComponent },
      { path:'func-portal/auto-layout/same-size-layout',component: SameSizeLayoutComponent },
      { path:'func-portal/templet-layout',component: TempletLayoutComponent }
    ]
  }
];

/**
 * tutorial_func路由模块
 * @export
 * @class TutorialFuncRouterModule
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
export class TutorialFuncRouterModule { }
