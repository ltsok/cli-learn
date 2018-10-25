import { NgModule } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { constant } from './echarts.constant';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WafEchartComponent } from './waf-echart/waf-echart.component';
import * as echarts from "echarts";

export * from './waf-echart/waf-echart.component';
export { echarts };

/**
 * echarts组件库引入模块
 * @export
 * @class WafEchartsModule
 */
@NgModule({
  declarations: [
    WafEchartComponent
  ],
  imports: [
    BrowserAnimationsModule
  ],
  exports: [
    WafEchartComponent
  ]
})
export class EchartsModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof EchartsModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize echarts lead-module.');
  }
}
