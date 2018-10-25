import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WafTopologyComponent } from './waf-topology.component';
import { constant } from './waf-topology.constant';
import {WafITopoMap} from './interface/waf-itopomap.interface';
import {WafQuneeConcreteTopoMap} from './waf-quneeconcretetopomap';
import {WafTopologyService} from './service/waf-topology.service';

import {WafTopoStyle} from './model/waf-style.model';
import {WafMapStyle} from './model/waf-mapstyle.model';
import {WafNodeStyle} from './model/waf-nodestyle.model';
import {WafLinkStyle} from './model/waf-linkstyle.model';
import {WafRangeStyle} from './model/waf-rangestyle.model';
import {WafLabelStyle} from './model/waf-labelstyle.model';

import { NgZorroAntdModule } from 'ng-zorro-antd';

export * from './waf-topology.component';
export * from './model/waf-style.model';
export * from './model/waf-mapstyle.model';
export * from './model/waf-nodestyle.model';
export * from './model/waf-linkstyle.model';
export * from './model/waf-rangestyle.model';
export * from './model/waf-labelstyle.model';
export * from './model/waf-tnode.model';
export * from './model/waf-tnodeicon.model';
export * from './model/waf-tlink.model';
export * from './model/waf-tlabel.model';

/**
 * waf-datatable模块
 * @export
 * @class WafTopologyComponent
 */

@NgModule({
  declarations: [
    WafTopologyComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    NgZorroAntdModule
  ],
  exports: [
    WafTopologyComponent
  ],
  providers: [
    WafTopologyService,
    { provide: WafITopoMap, useClass: WafQuneeConcreteTopoMap, multi: true }
  ]
})
export class WafTopologyModule {
  /**
   * Creates an instance of WafTopologyModule.
   * @param {LoggerService} logger
   * @memberof WafTopologyComponent
   */
  constructor() {
  }
}
