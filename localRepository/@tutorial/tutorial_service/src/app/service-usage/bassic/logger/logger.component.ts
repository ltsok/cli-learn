import { Component } from '@angular/core';
import { constant } from '../../../tutorial-service.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * logger
 * @export
 * @class LoggerComponent
 */
@Component({
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.scss']
})
export class LoggerComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialServiceModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
