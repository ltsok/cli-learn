import { Component, ViewChild } from '@angular/core';
import { constant } from '../../unm-alarm.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { UnmAlarmHttpService } from '../../service/unm-alarm-http.service';
import { Router, NavigationStart } from '@angular/router';
/**
 * alarm-detail
 * @export
 * @class AlarmDetailComponent
 */
@Component({
  templateUrl: './alarm-detail.component.html',
  styleUrls: ['./alarm-detail.component.scss'],
  providers: [UnmAlarmHttpService]
})
export class AlarmDetailComponent {
  dataSet = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 40,
      address: 'London Park',
    }
  ];
  alarmData;
  constructor(private context: ContextService, private router: Router) {
    this.alarmData = this.context.getRouterParam();
    console.log(this.alarmData);
  }

  investigation() {
    this.context.setRouterParam(this.alarmData);
    this.router.navigate(['/unm-alarm/view/alarm-investigation']);
  }
}
