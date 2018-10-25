import { Component } from '@angular/core';
import { constant } from '../../../tutorial-service.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * port
 * @export
 * @class PortComponent
 */
@Component({
  templateUrl: './port.component.html',
  styleUrls: ['./port.component.scss']
})
export class PortComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialServiceModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
