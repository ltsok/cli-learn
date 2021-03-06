import { Component } from '@angular/core';
import { constant } from '../../../tutorial-cli.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * cli-new
 * @export
 * @class CliNewComponent
 */
@Component({
  templateUrl: './cli-new.component.html',
  styleUrls: ['./cli-new.component.scss']
})
export class CliNewComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialCliModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
