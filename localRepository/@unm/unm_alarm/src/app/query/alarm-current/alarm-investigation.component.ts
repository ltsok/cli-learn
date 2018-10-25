import { Component, ViewChild } from '@angular/core';
import { constant } from '../../unm-alarm.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { UnmAlarmHttpService } from '../../service/unm-alarm-http.service';

/**
 * alarm-investigation
 * @export
 * @class AlarmInvestigationComponent
 */
@Component({
  templateUrl: './alarm-investigation.component.html',
  styleUrls: ['./alarm-investigation.component.scss'],
  providers: [UnmAlarmHttpService]
})
export class AlarmInvestigationComponent {
  alarmData;
  constructor(private context: ContextService) {
    this.alarmData = this.context.getRouterParam();
    console.log(this.alarmData);
  }
}
