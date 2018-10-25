import { Component } from '@angular/core';
import { constant } from '../../tutorial-user.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * system-operation
 * @export
 * @class SystemOperationComponent
 */
@Component({
  templateUrl: './system-operation.component.html',
  styleUrls: ['./system-operation.component.scss']
})
export class SystemOperationComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialUserModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
