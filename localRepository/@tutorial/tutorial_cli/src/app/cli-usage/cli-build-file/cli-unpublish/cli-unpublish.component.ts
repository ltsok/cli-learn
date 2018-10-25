import { Component } from '@angular/core';
import { constant } from '../../../tutorial-cli.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * cli-unpublish
 * @export
 * @class CliUnpublishComponent
 */
@Component({
  templateUrl: './cli-unpublish.component.html',
  styleUrls: ['./cli-unpublish.component.scss']
})
export class CliUnpublishComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialCliModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
