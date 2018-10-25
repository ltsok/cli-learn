import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '@waf_service/logger';
import { constant } from './unm-ne-manager.constant';
import { UnmNeManagerRouterModule } from './unm-ne-manager-routing.module';
import { UnmNeManagerComponent } from './unm-ne-manager.component';
import { UnmNeManagerMenuService } from './service/unm-ne-manager-menu.service';
import { NeBoxComponent } from './ne-box/ne-box.component';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { BoxInfoComponent } from "./box-info/box-info.component";
import { BoxViewComponent } from "./box-view/box-view.component";
import { UnmNeManagerHttpService } from "./service/unm-ne-manager-http.service";
import { TransModule } from "@waf_service/i18n";

/**
 * unm_ne_manager模块
 * @export
 * @class UnmNeManagerModule
 */
@NgModule({
  declarations: [
    UnmNeManagerComponent,
    NeBoxComponent,
    BoxInfoComponent,
    BoxViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UnmNeManagerRouterModule,
    NgZorroAntdModule,
    BrowserModule, BrowserAnimationsModule, GridModule, TransModule
  ],
  providers: [
    UnmNeManagerHttpService,
    { provide: 'tpi.menu', useClass: UnmNeManagerMenuService, multi: true }
  ]
})
export class UnmNeManagerModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof UnmNeManagerModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize unm_ne_manager module.');
  }
}
