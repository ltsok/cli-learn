import { Component } from '@angular/core';
import { constant } from '../../tutorial-practice.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * system-web
 * @export
 * @class SystemWebComponent
 */
@Component({
  templateUrl: './system-web.component.html',
  styleUrls: ['./system-web.component.scss']
})
export class SystemWebComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialPracticeModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
