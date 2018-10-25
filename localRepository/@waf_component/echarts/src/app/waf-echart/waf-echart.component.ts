import { Component, AfterViewInit, Input } from '@angular/core';
import * as echarts from "echarts";

/**
 * 封装waf_echart组件
 * @export
 * @class WafEchartComponent
 */
@Component({
  selector: 'waf-echart',
  templateUrl: './waf-echart.component.html',
  styleUrls: ['./waf-echart.component.scss']

})
export class WafEchartComponent implements AfterViewInit {

  @Input() style: string;

  /** 当前chart对象 */
  chart: any;

  /** 当前chart对象ID */
  chartId: string = "chart_" + Math.round(Math.random() * 10000);

  /**
   * 渲染完成
   * @memberof WafEchartComponent
   */
  ngAfterViewInit(): void {
    this.chart = echarts.init(document.getElementById(this.chartId));
  }

  /**
   * 获取当前chart对象
   * @returns {*}
   * @memberof WafEchartComponent
   */
  getChart(): any {
    return this.chart;
  }

  /**
   * 设置chart配置
   * @param {*} option
   * @memberof WafEchartComponent
   */
  setOption(option: any) {
    this.chart.setOption(option);
  }
}


