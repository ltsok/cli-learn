import { Component } from '@angular/core';
import { constant } from '../../tutorial-practice.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * system-mobile
 * @export
 * @class SystemMobileComponent
 */
@Component({
  templateUrl: './system-mobile.component.html',
  styleUrls: ['./system-mobile.component.scss']
})
export class SystemMobileComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialPracticeModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
