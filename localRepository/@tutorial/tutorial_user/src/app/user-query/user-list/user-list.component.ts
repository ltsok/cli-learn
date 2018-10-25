import { Component } from '@angular/core';
import { constant } from '../../tutorial-user.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * user-list
 * @export
 * @class UserListComponent
 */
@Component({
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialUserModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
