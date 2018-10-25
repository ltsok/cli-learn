import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { TransModule } from '@waf_service/i18n';
import { constant } from './submenu.constant';
import { SubmenuRouterModule } from './submenu-routing.module';
import { SubmenuComponent } from './submenu.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

/**
 * submenu模块
 * @export
 * @class SubmenuModule
 */
@NgModule({
  declarations: [
    SubmenuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TransModule,
    SubmenuRouterModule,
    NgZorroAntdModule
  ],
  providers: [
  ]
})
export class SubmenuModule {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof SubmenuModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize submenu module.');
  }
}
