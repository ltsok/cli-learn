import { Component } from '@angular/core';
import { constant } from '../../../tutorial-cli.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * cli-serve
 * @export
 * @class CliServeComponent
 */
@Component({
  templateUrl: './cli-serve.component.html',
  styleUrls: ['./cli-serve.component.scss']
})
export class CliServeComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialCliModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
