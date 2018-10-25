import { Component } from '@angular/core';
import { constant } from '../../tutorial-user.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * msg-remind
 * @export
 * @class MsgRemindComponent
 */
@Component({
  templateUrl: './msg-remind.component.html',
  styleUrls: ['./msg-remind.component.scss']
})
export class MsgRemindComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialUserModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
