import { Component } from '@angular/core';
import { constant } from '../../tutorial-user.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * user-add
 * @export
 * @class UserAddComponent
 */
@Component({
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialUserModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
