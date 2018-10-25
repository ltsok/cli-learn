import { Component } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { constant } from '../../tutorial-start.constant';

/**
 * common-commands
 * @export
 * @class CommonCommandsComponent
 */
@Component({
  templateUrl: './common-commands.component.html',
  styleUrls: ['./common-commands.component.scss']
})
export class CommonCommandsComponent {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialStartModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
