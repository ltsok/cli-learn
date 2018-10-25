import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './unm-settings.constant';
import { UnmSettingsRouterModule } from './unm-settings-routing.module';
import { UnmSettingsComponent } from './unm-settings.component';
import { SettingsUserComponent } from './individual/settings-user/settings-user.component';
import { SettingsAlarmComponent } from './individual/settings-alarm/settings-alarm.component';
import { UnmSettingsMenuService } from './service/unm-settings-menu.service';

/**
 * unm_settings模块
 * @export
 * @class UnmSettingsModule
 */
@NgModule({
  declarations: [
    UnmSettingsComponent,
    SettingsUserComponent,
    SettingsAlarmComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UnmSettingsRouterModule
  ],
  providers: [
    { provide: 'tpi.menu', useClass: UnmSettingsMenuService, multi: true }
  ]
})
export class UnmSettingsModule {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof UnmSettingsModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize unm_settings module.');
  }
}
