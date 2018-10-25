import { Component } from '@angular/core';
import { constant } from '../../../tutorial-cli.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * cli-build
 * @export
 * @class CliBuildComponent
 */
@Component({
  templateUrl: './cli-build.component.html',
  styleUrls: ['./cli-build.component.scss']
})
export class CliBuildComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialCliModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
