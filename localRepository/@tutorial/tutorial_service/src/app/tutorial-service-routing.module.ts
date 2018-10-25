import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorialServiceComponent } from './tutorial-service.component';
import {ServiceThoughtComponent} from "./service-design/service-thought/service-thought.component";
import {ContextComponent} from "./service-usage/apply/context/context.component";
import {HttpComponent} from "./service-usage/apply/http/http.component";
import {PushComponent} from "./service-usage/apply/push/push.component";
import {AuthComponent} from "./service-usage/bassic/auth/auth.component";
import {CacheComponent} from "./service-usage/bassic/cache/cache.component";
import {EventComponent} from "./service-usage/bassic/event/event.component";
import {I18nComponent} from "./service-usage/bassic/i18n/i18n.component";
import {LoggerComponent} from "./service-usage/bassic/logger/logger.component";
import {PortComponent} from "./service-usage/bassic/port/port.component";
import {RouterComponent} from "./service-usage/bassic/router/router.component";
import {StorageComponent} from "./service-usage/bassic/storage/storage.component";
import {ThemeComponent} from "./service-usage/bassic/theme/theme.component";

// 路由配置
export const routes: Routes = [
  {
    path: 'tutorial-service', component: TutorialServiceComponent,
    children: [
      { path:'service-design/service-thought',component: ServiceThoughtComponent },
      { path:'service-usage/apply/context',component: ContextComponent },
      { path:'service-usage/apply/http',component: HttpComponent },
      { path:'service-usage/apply/push',component: PushComponent },
      { path:'service-usage/bassic/auth',component: AuthComponent },
      { path:'service-usage/bassic/cache',component: CacheComponent },
      { path:'service-usage/bassic/event',component: EventComponent },
      { path:'service-usage/bassic/i18n',component: I18nComponent },
      { path:'service-usage/bassic/logger',component: LoggerComponent },
      { path:'service-usage/bassic/port',component: PortComponent },
      { path:'service-usage/bassic/router',component: RouterComponent },
      { path:'service-usage/bassic/storage',component: StorageComponent },
      { path:'service-usage/bassic/theme',component: ThemeComponent }
    ]
  }
];

/**
 * tutorial_service路由模块
 * @export
 * @class TutorialServiceRouterModule
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
export class TutorialServiceRouterModule { }
