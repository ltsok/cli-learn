import { Component } from '@angular/core';
import { constant } from '../../unm-settings.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * settings-user
 * @export
 * @class SettingsUserComponent
 */
@Component({
  templateUrl: './settings-user.component.html',
  styleUrls: ['./settings-user.component.scss']
})
export class SettingsUserComponent {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof UnmSettingsModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
