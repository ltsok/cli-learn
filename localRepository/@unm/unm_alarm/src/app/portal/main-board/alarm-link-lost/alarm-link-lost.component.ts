import { Component } from '@angular/core';
import { constant } from '../../../unm-alarm.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * alarm-link-lost
 * @export
 * @class AlarmLinkLostComponent
 */
@Component({
  templateUrl: './alarm-link-lost.component.html',
  styleUrls: ['./alarm-link-lost.component.scss']
})
export class AlarmLinkLostComponent {
  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {ContextService} context
   * @memberof UnmAlarmModule
   */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
  cols = [
    { "field": "col1", "title": "连纤名" },
    { "field": "col2", "title": "源网元" },
    { "field": "col3", "title": "源端口" },
    { "field": "col4", "title": "宿网元" },
    { "field": "col5", "title": "宿端口" },
  ]
  data;

  ngOnInit() {
    this.data = [
      {
        "No": 1,
        "col1": "网元1-网元2",
        "col2": "网元1",
        "col3": "单盘1[1]/端口1",
        "col4": "网元2",
        "col5": "单盘2[1]/端口1",
      },
      {
        "No": 2,
        "col1": "网元1-网元2",
        "col2": "网元1",
        "col3": "单盘1[1]/端口1",
        "col4": "网元2",
        "col5": "单盘2[1]/端口1",
      },
      {
        "No": 3,
        "col1": "网元1-网元2",
        "col2": "网元1",
        "col3": "单盘1[1]/端口1",
        "col4": "网元2",
        "col5": "单盘2[1]/端口1",
      },
      {
        "No": 4,
        "col1": "网元1-网元2",
        "col2": "网元1",
        "col3": "单盘1[1]/端口1",
        "col4": "网元2",
        "col5": "单盘2[1]/端口1",
      },
    ]
  }
}

