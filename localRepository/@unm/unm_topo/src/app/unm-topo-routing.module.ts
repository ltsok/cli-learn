import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnmTopoComponent } from './unm-topo.component';
import { TopoPhysicsComponent } from './topo-physics/topo-physics.component';
import { TopoGisComponent } from './topo-gis/topo-gis.component';
// 路由配置
export const routes: Routes = [
  {
    path: 'unm-topo', component: UnmTopoComponent,
    children: [
      { path: 'topo-physics', component: TopoPhysicsComponent },
      { path: 'topo-gis', component: TopoGisComponent },
    ]
  }
];

/**
 * unm_topo路由模块
 * @export
 * @class UnmTopoRouterModule
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
export class UnmTopoRouterModule { }
