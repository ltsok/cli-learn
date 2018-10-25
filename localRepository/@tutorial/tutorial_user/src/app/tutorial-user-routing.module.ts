import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorialUserComponent } from './tutorial-user.component';
import {AuthDistributionComponent} from "./user-operation/auth-distribution/auth-distribution.component";
import {SystemOperationComponent} from "./user-operation/system-operation/system-operation.component";
import {UserAddComponent} from "./user-operation/user-add/user-add.component";
import {PersonalInformationComponent} from "./user-query/personal-information/personal-information.component";
import {UserListComponent} from "./user-query/user-list/user-list.component";
import {MsgRemindComponent} from "./user-remind/msg-remind/msg-remind.component";


// 路由配置
export const routes: Routes = [
  {
    path: 'tutorial-user', component: TutorialUserComponent,
    children: [
      { path:'user-operation/auth-distribution', component: AuthDistributionComponent },
      { path:'user-operation/system-operation', component: SystemOperationComponent },
      { path:'user-operation/user-add', component: UserAddComponent },
      { path:'user-query/personal-information', component: PersonalInformationComponent },
      { path:'user-query/user-list', component: UserListComponent },
      { path:'user-remind/msg-remind', component: MsgRemindComponent }
    ]
  }
];

/**
 * tutorial_management路由模块
 * @export
 * @class TutorialManagementRouterModule
 */
@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class TutorialUserRoutingModule { }
