import { Component } from '@angular/core';
import { constant } from '../../tutorial-service.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * service-thought
 * @export
 * @class ServiceThoughtComponent
 */
@Component({
  templateUrl: './service-thought.component.html',
  styleUrls: ['./service-thought.component.scss']
})
export class ServiceThoughtComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialServiceModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
