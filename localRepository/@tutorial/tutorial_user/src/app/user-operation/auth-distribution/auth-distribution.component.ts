import { Component } from '@angular/core';
import { constant } from '../../tutorial-user.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * auth-distribution
 * @export
 * @class AuthDistributionComponent
 */
@Component({
  templateUrl: './auth-distribution.component.html',
  styleUrls: ['./auth-distribution.component.scss']
})
export class AuthDistributionComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialUserModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
