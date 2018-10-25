import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { constant } from './unm-alarm.constant';
import { UnmAlarmRouterModule } from './unm-alarm-routing.module';
import { UnmAlarmComponent } from './unm-alarm.component';
import { AlarmCurrentComponent } from './query/alarm-current/alarm-current.component';
import { AlarmHistoryComponent } from './query/alarm-history/alarm-history.component';
import { UnmAlarmMenuService } from './service/unm-alarm-menu.service';
import { UnmAlarmQuickEntryService } from './service/unm-alarm-quick-entry.service'
import { AlarmProcessComponent } from './portal/quick-entry/alarm-process.component';
import { UnmAlarmDataBoardService } from './service/unm-alarm-data-board.service';
import { AlarmLevelComponent } from './portal/data-board/alarm-level.component';
import { AlarmTypeComponent } from './portal/data-board/alarm-type.component';
import { AlarmStatusComponent } from './portal/data-board/alarm-status.component';
import { AlarmTopNComponent } from './portal/data-board/alarm-topN.component';
import { KeyAlarmMonitorComponent } from './portal/data-board/key-alarm-monitor.component';
import { WafDropdownModule } from '@waf_component/waf_dropdown';
import { WafTagModule } from '@waf_component/waf_tag';
import { EchartsModule } from '@waf_component/echarts'
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { GridModule } from '@progress/kendo-angular-grid';
import { AlarmDetailComponent } from './query/alarm-current/alarm-detail.component'
import { AlarmInvestigationComponent } from './query/alarm-current/alarm-investigation.component'
import { registerLocaleData } from '@angular/common';
import { PushService } from "@waf_service/push";
import { EventService } from "@waf_service/event";

// import { UnmAlarmConditionModel } from './model/unm-alarm.model';
// export { UnmAlarmConditionModel } from './model/unm-alarm.model';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);

import { UnmAlarmHttpService } from './service/unm-alarm-http.service';
import { AlarmStatisticsComponent, TemplateModel } from './portal/main-board/alarm-statistics/alarm-statistics.component';
import { AlarmLinkLostComponent } from './portal/main-board/alarm-link-lost/alarm-link-lost.component';
import { AlarmLinkAlertComponent } from './portal/main-board/alarm-link-alert/alarm-link-alert.component';

/**
 * unm_alarm模块
 * @export
 * @class UnmAlarmModule
 */
@NgModule({
  declarations: [
    UnmAlarmComponent,
    AlarmCurrentComponent,
    AlarmHistoryComponent,
    AlarmProcessComponent,
    AlarmLevelComponent,
    AlarmTypeComponent,
    AlarmStatusComponent,
    AlarmTopNComponent,
    KeyAlarmMonitorComponent,
    AlarmStatisticsComponent,
    AlarmLinkLostComponent,
    AlarmLinkAlertComponent,
    AlarmDetailComponent,
    AlarmInvestigationComponent
  ],
  entryComponents: [
    AlarmProcessComponent,
    AlarmLevelComponent,
    AlarmTypeComponent,
    AlarmStatusComponent,
    AlarmTopNComponent,
    KeyAlarmMonitorComponent,
    AlarmStatisticsComponent,
    AlarmLinkLostComponent,
    AlarmLinkAlertComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UnmAlarmRouterModule,
    NgZorroAntdModule,
    WafDropdownModule,
    WafTagModule,
    GridModule,
    EchartsModule
  ],
  providers: [UnmAlarmHttpService,
    { provide: 'tpi.menu', useClass: UnmAlarmMenuService, multi: true },
    { provide: 'func.databoard', useClass: UnmAlarmDataBoardService, multi: true },
    { provide: 'func.quickentry', useClass: UnmAlarmQuickEntryService, multi: true },
  ]
})
export class UnmAlarmModule {


  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {ContextService} context
   * @memberof UnmAlarmModule
   */
  constructor(private alarmHttpService: UnmAlarmHttpService, private wsService: PushService, private event: EventService, private logger: LoggerService, private context: ContextService) {

    this.logger.info(constant.identifier, 'Initialize unm_alarm module.');

    //监听到wbsocket通道打开后默认订阅告警信息
    /*
    this.context.subscribe("event.websocket.connected", () => {
      let me = this;
      return new Promise((resolve, reject) => {
        me.wsService.subscribe("/alm/statistic", (retValue: any) => {
          let alarmStatisticData = JSON.parse(retValue.body);
          //1、将上报的告警模板统计信息在前端发布，用于其他组件或模块使用，避免重复订阅
          me.event.publish("event.alarm.statictic", alarmStatisticData);

          //2、处理上报信息，更新告警板展示信息
          //2.1 初始化查询当前用户告警模板信息
          this.alarmHttpService.getUserAlarmTemplates().then(
            (value: any) => {
              //2.2 根据当前用户告警模板信息获取默认模板信息
              let defaultTemplate;
              for (let i = 0; i < value.length; i++) {
                let temp = value[i];
                if (temp.isDefaultCurAlarmMonitorTemplate == 1) {
                  defaultTemplate = temp;
                  break;
                }
              }
              //2.3 根据当前用户默认模板信息及推送统计信息获取默认模板的推送信息
              if (defaultTemplate) {
                let almData;
                for (let i = 0; i < alarmStatisticData.length; i++) {
                  let element = alarmStatisticData[i];
                  if (element.object && element.object.queryID == defaultTemplate.templateId) {
                    almData = element.object;
                    break;
                  }
                }
                //2.4 根据默认模板的推送信息更新告警板
                if (almData) {
                  let criticalItemBean = almData.criticalItemBean;
                  let majorItemBean = almData.majorItemBean;
                  let minorItemBean = almData.minorItemBean;
                  let warningItemBean = almData.warningItemBean;
                  let alarmNo = new Map<number, number>();
                  // alarmNo.set(2010100, 10);//重点告警监控信息
                  alarmNo.set(2010101, criticalItemBean.totalCount);//紧急告警信息
                  alarmNo.set(2010102, majorItemBean.totalCount);//主要告警信息
                  alarmNo.set(2010103, minorItemBean.totalCount);//次要告警信息
                  alarmNo.set(2010104, warningItemBean.totalCount);//提示告警信息
                  // alarmNo.set(2010106, 60);//中断提示告警信息
                  // alarmNo.set(2010107, 70);//预警提示告警信息

                  this.context.setSupervisoryInfo(alarmNo, null);
                }

              } else {
                //若当前无默认模板，则将告警板信息全部更新为0

                let alarmNo = new Map<number, number>();
                // alarmNo.set(2010100, 10);//重点告警监控信息
                alarmNo.set(2010101, 0);//紧急告警信息
                alarmNo.set(2010102, 0);//主要告警信息
                alarmNo.set(2010103, 0);//次要告警信息
                alarmNo.set(2010104, 0);//提示告警信息
                // alarmNo.set(2010106, 60);//中断提示告警信息
                // alarmNo.set(2010107, 70);//预警提示告警信息

                this.context.setSupervisoryInfo(alarmNo, null);
              }
            },
            (desc: string) => { console.log(desc) }
          );

        })
        resolve();
      });
    });
    */

    //监听到首页shortcut初始化后提供告警统计信息
    this.context.subscribe("event.templet.shortcut.after.view.init", () => {

      return new Promise((resolve, reject) => {

        let alarmNo = new Map<number, number>();
        alarmNo.set(2010100, 10);
        alarmNo.set(2010101, 20);
        alarmNo.set(2010102, 30);
        alarmNo.set(2010103, 999);
        alarmNo.set(2010104, 1111);
        alarmNo.set(2010106, 60);
        alarmNo.set(2010107, 70);

        let alarmFlash = new Map<number, boolean>();
        alarmFlash.set(2010100, true);
        alarmFlash.set(2010102, true);
        alarmFlash.set(2010107, true);


        this.context.setSupervisoryInfo(alarmNo, alarmFlash);

        resolve();
      });
    });
  }
}
