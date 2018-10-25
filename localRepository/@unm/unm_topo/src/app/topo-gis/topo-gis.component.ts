import { Component } from '@angular/core';
import { constant } from '../unm-topo.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * topo-gis
 * @export
 * @class TopoGisComponent
 */
@Component({
  templateUrl: './topo-gis.component.html',
  styleUrls: ['./topo-gis.component.scss']
})
export class TopoGisComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof UnmTopoModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
