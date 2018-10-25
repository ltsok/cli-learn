import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { TpiService } from '@waf_service/tpi';
import { constant } from './unm-user.constant';
import { UnmUserRouterModule } from './unm-user-routing.module';
import { UnmUserComponent } from './unm-user.component';
import { UserInfoComponent } from './query/user-info/user-info.component';
import { UnmUserMenuService } from './service/unm-user-menu.service';
import { UnmUserLoginService } from './service/unm-user-login.service';
import { PushService } from "@waf_service/push";
import { ContextService } from "@waf_service/context";
import { NzModalService } from 'ng-zorro-antd';
/**
 * unm_user模块
 * @export
 * @class UnmUserModule
 */
@NgModule({
  declarations: [
    UnmUserComponent,
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UnmUserRouterModule,
  ],
  providers: [
    { provide: 'tpi.menu', useClass: UnmUserMenuService, multi: true },
    // { provide: 'tpi.login', useClass: UnmUserLoginService, }
  ]
})
export class UnmUserModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof UnmUserModule
   */
  constructor(private logger: LoggerService, private pushService: PushService, private context: ContextService, private tpi: TpiService, private modal: NzModalService) {
    this.logger.info(constant.identifier, 'Initialize unm_user module.');

    this.context.subscribe('event.websocket.connected', () => {
      let me = this;
      return new Promise((resolve, reject) => {
        let userId = me.context.getLoginInfo().user.id;
        console.log('userId' + userId);
        if (userId) {
          me.pushService.subscribe(`/user/msgNotify/${userId}`, (res) => {
            console.log('/user/msgNotify/=>' + res);
            let body = JSON.parse(res.body);
            me.modal.warning({
              nzTitle: '登陆提醒',
              nzContent: body.msg,
              nzOnOk: () => {
                me.tpi.logout();
              }
            });
          })
        }
        resolve();
      })
    })
  }
}
