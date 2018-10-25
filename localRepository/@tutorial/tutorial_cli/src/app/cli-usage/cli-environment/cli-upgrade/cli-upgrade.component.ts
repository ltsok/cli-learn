import { Component } from '@angular/core';
import { constant } from '../../../tutorial-cli.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * cli-upgrade
 * @export
 * @class CliUpgradeComponent
 */
@Component({
  templateUrl: './cli-upgrade.component.html',
  styleUrls: ['./cli-upgrade.component.scss']
})
export class CliUpgradeComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialCliModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
