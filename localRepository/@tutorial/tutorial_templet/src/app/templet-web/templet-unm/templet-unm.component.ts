import { Component } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * templet-unm
 * @export
 * @class TempletUnmComponent
 */
@Component({
  templateUrl: './templet-unm.component.html',
  styleUrls: ['./templet-unm.component.scss']
})
export class TempletUnmComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialTempletModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
