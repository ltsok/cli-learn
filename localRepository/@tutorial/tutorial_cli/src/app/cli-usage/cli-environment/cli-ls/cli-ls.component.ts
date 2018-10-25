import { Component } from '@angular/core';
import { constant } from '../../../tutorial-cli.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * cli-ls
 * @export
 * @class CliLsComponent
 */
@Component({
  templateUrl: './cli-ls.component.html',
  styleUrls: ['./cli-ls.component.scss']
})
export class CliLsComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialCliModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
