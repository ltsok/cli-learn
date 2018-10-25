import { Component } from '@angular/core';
import { constant } from '../../../tutorial-cli.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * cli-reinit
 * @export
 * @class CliReinitComponent
 */
@Component({
  templateUrl: './cli-reinit.component.html',
  styleUrls: ['./cli-reinit.component.scss']
})
export class CliReinitComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialCliModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
