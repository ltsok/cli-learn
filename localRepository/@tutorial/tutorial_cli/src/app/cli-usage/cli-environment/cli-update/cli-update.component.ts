import { Component } from '@angular/core';
import { constant } from '../../../tutorial-cli.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * cli-update
 * @export
 * @class CliUpdateComponent
 */
@Component({
  templateUrl: './cli-update.component.html',
  styleUrls: ['./cli-update.component.scss']
})
export class CliUpdateComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialCliModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
