import { Component } from '@angular/core';
import { constant } from '../../../tutorial-cli.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * cli-publish
 * @export
 * @class CliPublishComponent
 */
@Component({
  templateUrl: './cli-publish.component.html',
  styleUrls: ['./cli-publish.component.scss']
})
export class CliPublishComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialCliModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
