import { Component } from '@angular/core';
import { constant } from '../../unm-user.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * user-info
 * @export
 * @class UserInfoComponent
 */
@Component({
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof UnmUserModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
