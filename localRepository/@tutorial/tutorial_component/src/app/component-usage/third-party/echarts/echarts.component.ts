import { Component } from '@angular/core';
import { constant } from '../../../tutorial-component.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * echarts
 * @export
 * @class EchartsComponent
 */
@Component({
  templateUrl: './echarts.component.html',
  styleUrls: ['./echarts.component.scss']
})
export class EchartsComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialComponentModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
