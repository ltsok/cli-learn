import { Component } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { constant } from '../../tutorial-start.constant';

/**
 * common-problems
 * @export
 * @class CommonProblemsComponent
 */
@Component({
  templateUrl: './common-problems.component.html',
  styleUrls: ['./common-problems.component.scss']
})
export class CommonProblemsComponent {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialStartModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
