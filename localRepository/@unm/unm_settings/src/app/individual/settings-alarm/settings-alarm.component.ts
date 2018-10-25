import { Component } from '@angular/core';
import { constant } from '../../unm-settings.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * settings-alarm
 * @export
 * @class SettingsAlarmComponent
 */
@Component({
  templateUrl: './settings-alarm.component.html',
  styleUrls: ['./settings-alarm.component.scss']
})
export class SettingsAlarmComponent {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof UnmSettingsModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
