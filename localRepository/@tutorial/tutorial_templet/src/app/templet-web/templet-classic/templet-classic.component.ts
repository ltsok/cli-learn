import { Component } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * templet-classic
 * @export
 * @class TempletClassicComponent
 */
@Component({
  templateUrl: './templet-classic.component.html',
  styleUrls: ['./templet-classic.component.scss']
})
export class TempletClassicComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialTempletModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
