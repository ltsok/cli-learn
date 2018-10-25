import { Component } from '@angular/core';
import { constant } from '../../../../tutorial-component.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * select-object
 * @export
 * @class SelectObjectComponent
 */
@Component({
  templateUrl: './select-object.component.html',
  styleUrls: ['./select-object.component.scss']
})
export class SelectObjectComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialComponentModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
