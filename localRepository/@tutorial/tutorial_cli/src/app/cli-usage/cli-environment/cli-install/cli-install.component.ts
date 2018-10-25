import { Component } from '@angular/core';
import { constant } from '../../../tutorial-cli.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * cli-install
 * @export
 * @class CliInstallComponent
 */
@Component({
  templateUrl: './cli-install.component.html',
  styleUrls: ['./cli-install.component.scss']
})
export class CliInstallComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialCliModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
