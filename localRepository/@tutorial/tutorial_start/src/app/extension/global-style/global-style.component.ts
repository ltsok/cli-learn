import { Component } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { constant } from '../../tutorial-start.constant';

/**
 * global-style
 * @export
 * @class GlobalStyleComponent
 */
@Component({
  templateUrl: './global-style.component.html',
  styleUrls: ['./global-style.component.scss']
})
export class GlobalStyleComponent {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialStartModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
