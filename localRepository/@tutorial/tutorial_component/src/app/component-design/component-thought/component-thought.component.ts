import { Component } from '@angular/core';
import { constant } from '../../tutorial-component.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * component-thought
 * @export
 * @class ComponentThoughtComponent
 */
@Component({
  templateUrl: './component-thought.component.html',
  styleUrls: ['./component-thought.component.scss']
})
export class ComponentThoughtComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialComponentModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
