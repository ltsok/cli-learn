import { Component } from '@angular/core';
import { constant } from '../../tutorial-cli.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * cli-thought
 * @export
 * @class CliThoughtComponent
 */
@Component({
  templateUrl: './cli-thought.component.html',
  styleUrls: ['./cli-thought.component.scss']
})
export class CliThoughtComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialCliModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
