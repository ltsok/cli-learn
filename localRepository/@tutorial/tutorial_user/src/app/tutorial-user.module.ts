import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './tutorial-user.constant';
import { TutorialUserRoutingModule } from './tutorial-user-routing.module';
import { TutorialUserComponent } from './tutorial-user.component';
import { TutorialUserMenuService } from './service/tutorial-user-menu.service';
import {AuthDistributionComponent} from "./user-operation/auth-distribution/auth-distribution.component";
import {SystemOperationComponent} from "./user-operation/system-operation/system-operation.component";
import {UserAddComponent} from "./user-operation/user-add/user-add.component";
import {PersonalInformationComponent} from "./user-query/personal-information/personal-information.component";
import {UserListComponent} from "./user-query/user-list/user-list.component";
import {MsgRemindComponent} from "./user-remind/msg-remind/msg-remind.component";

/**
 * tutorial_management模块
 * @export
 * @class TutorialUserModule
 */
@NgModule({
  declarations: [
    TutorialUserComponent,
    AuthDistributionComponent,
    SystemOperationComponent,
    UserAddComponent,
    PersonalInformationComponent,
    UserListComponent,
    MsgRemindComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TutorialUserRoutingModule
  ],
  providers: [
    { provide: 'tpi.menu', useClass: TutorialUserMenuService, multi: true }
  ]
})
export class TutorialUserModule {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof TutorialUserModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize tutorial_user module.');
  }
}
