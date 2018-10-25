import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './unm-logger.constant';
import { UnmLoggerRouterModule } from './unm-logger-routing.module';
import { UnmLoggerComponent } from './unm-logger.component';
import { LoggerU2kComponent } from './query/logger-u2k/logger-u2k.component';
import { UnmLoggerMenuService } from './service/unm-logger-menu.service';

/**
 * unm_logger模块
 * @export
 * @class UnmLoggerModule
 */
@NgModule({
  declarations: [
    UnmLoggerComponent,
    LoggerU2kComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UnmLoggerRouterModule
  ],
  providers: [
    { provide: 'tpi.menu', useClass: UnmLoggerMenuService, multi: true }
  ]
})
export class UnmLoggerModule {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof UnmLoggerModule
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize unm_logger module.');
  }
}
