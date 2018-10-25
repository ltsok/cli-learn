import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { TransModule } from '@waf_service/i18n';
import { constant } from './shortcut.constant';
import { ShortcutRouterModule } from './shortcut-routing.module';
import { ShortcutComponent } from './shortcut.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

/**
 * shortcut模块
 * @export
 * @class ShortcutModule
 */
@NgModule({
  declarations: [
    ShortcutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ShortcutRouterModule,
    TransModule,
    NgZorroAntdModule
  ],
  providers: [
  ]
})
export class ShortcutModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof ShortcutModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize shortcut module.');
  }
}
