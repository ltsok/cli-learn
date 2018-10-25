import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './unm-topo.constant';
import { UnmTopoRouterModule } from './unm-topo-routing.module';
import { UnmTopoComponent } from './unm-topo.component';
import { TopoPhysicsComponent } from './topo-physics/topo-physics.component';
import { TopoGisComponent } from './topo-gis/topo-gis.component';
import { UnmTopoMenuService } from './service/unm-topo-menu.service';

import { WafTopologyModule } from '@unm_component/waf_topology';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { TopoObjTreeComponent } from './topo-objtree/topo-objtree.component';
import { TopoDrawerComponent } from "./topo-drawer/topo-drawer.component";
import { SplitterModule } from '@progress/kendo-angular-layout';
import { TransModule } from "@waf_service/i18n";
import { WafIconModule } from "@unm_component/waf_icon";
/**
 * unm_topo模块
 * @export
 * @class UnmTopoModule
 */
@NgModule({
  declarations: [
    UnmTopoComponent,
    TopoPhysicsComponent,
    TopoGisComponent,
    TopoObjTreeComponent,
    TopoDrawerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UnmTopoRouterModule,
    WafTopologyModule,
    NgZorroAntdModule,
    SplitterModule,
    TransModule,
    WafIconModule
  ],
  providers: [
    { provide: 'tpi.menu', useClass: UnmTopoMenuService, multi: true }
  ]
})
export class UnmTopoModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof UnmTopoModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize unm_topo module.');
  }
}
