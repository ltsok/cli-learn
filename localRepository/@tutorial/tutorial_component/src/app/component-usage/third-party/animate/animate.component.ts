import { Component } from '@angular/core';
import { constant } from '../../../tutorial-component.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * animate
 * @export
 * @class AnimateComponent
 */
@Component({
  templateUrl: './animate.component.html',
  styleUrls: ['./animate.component.scss']
})
export class AnimateComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialComponentModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
