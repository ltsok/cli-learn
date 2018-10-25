import { Component } from '@angular/core';
import { constant } from '../../tutorial-practice.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * practice-thought
 * @export
 * @class PracticeThoughtComponent
 */
@Component({
  templateUrl: './practice-thought.component.html',
  styleUrls: ['./practice-thought.component.scss']
})
export class PracticeThoughtComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialPracticeModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
