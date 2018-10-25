import { NgModule } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { constant } from './zorro.constant';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule } from 'ng-zorro-antd';

/**
 * zorro组件库引入模块
 * @export
 * @class ngZorroModule
 */
@NgModule({
  declarations: [
  ],
  imports: [
    BrowserAnimationsModule,
    NgZorroAntdModule
  ],
  providers: [],
})
export class ZorroModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof NgZorroModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize ng-zorro lead-module.');

        //
    // let themeLink3: HTMLLinkElement = <HTMLLinkElement>document.getElementById('zorro-theme-css');
    // themeLink3.href = 'assets/themes/' + theme + '/zorro.css';
  }
}
