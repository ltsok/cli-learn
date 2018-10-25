import { Component } from '@angular/core';
import { constant } from '../../tutorial-func.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * func-thought
 * @export
 * @class FuncThoughtComponent
 */
@Component({
  templateUrl: './func-thought.component.html',
  styleUrls: ['./func-thought.component.scss']
})
export class FuncThoughtComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialFuncModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
