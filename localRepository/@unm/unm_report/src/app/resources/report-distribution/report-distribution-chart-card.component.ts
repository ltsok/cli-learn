import { Component, ViewChild, Input, SimpleChange } from '@angular/core';
import { constant } from '../../unm-report.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { TpiService } from "@waf_service/tpi";
import { RouterService } from "@waf_service/router";

import { colors, boardConfig, slotConfig, shelfConfig, portConfig, oModuleConfig, NEConfig } from "../../model/unm-report.model";
import { UnmReportHttpService } from "../../service/unm-report-http.service";
import { WafEchartComponent } from '@waf_component/echarts';

/**
 * 统计图卡片组件
 * @export
 * @class ReportDistributionChartCardComponent
 */
@Component({
  selector: 'report-chart-card',
  templateUrl: './report-distribution-chart-card.component.html',
  styleUrls: ['./report-distribution-chart-card.component.scss'],
  providers: [UnmReportHttpService]
})

export class ReportDistributionChartCardComponent {
  // board、ne、omodule、port、shelf、slot
  @Input() type: string;
  @Input() isfull: boolean;//宽度填满还是一半
  @Input() dataFields;//统计维度
  typeLabel;//类型标题
  config;//统计域配置
  boxStyle = { 'width': '550px', 'height': '300px' }; //图表盒子样式
  // 排行榜数据
  tops = [];
  // 排行榜长度，默认展示前9
  topsNum = 10;

  // 统计图数据
  chartData;
  // 图表实例
  @ViewChild(WafEchartComponent) wafEchartComponent: WafEchartComponent;
  waf_chart;
  // 统计结果列标记
  statisticColIndex;
  // 统计域选项
  statisticFields;
  statisticFieldsOptions;
  // 图表类型切换
  eType = true;
  // 柱图
  chartsOption0 = {
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    xAxis: [{
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    }],
    yAxis: [{ type: 'value' }],
    series: [{
      name: '直接访问',
      type: 'bar',
      data: [320, 332, 301, 334, 390, 330, 320]
    }]
  };
  // 饼图
  chartsOption1 = {
    color: colors,
    tooltip: {
      trigger: 'item',
    },
    // legend: {
    //   orient: 'vertical',
    //   left: 'right',
    //   top: 'center',
    //   data: ['周一', '周二']
    // },
    series: [{
      name: '直接访问',
      type: 'pie',
      data: [
        { value: 335, name: '周一' },
        { value: 1548, name: '周二' }
      ]
    }]
  };

  statisticKey;
  // 初始化统计数据
  statisticsData = {
    neList: null,
    portList: null,
    singlePlateList: null,
    slotList: null,
    boxList: null,
    opticalModuleList: null
  }
  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {ContextService} context
   * @param {UnmReportHttpService} http
   * @memberof UnmReportModule
   */
  constructor(private logger: LoggerService, private context: ContextService, private reportHttpService: UnmReportHttpService, private tpiService: TpiService, private router: RouterService) {
  }

  ngOnInit(): void {
    // 初始化类型配置数据
    switch (this.type) {
      case 'board':
        this.config = boardConfig;
        this.statisticKey = 'singlePlateList';
        this.typeLabel = this.reportHttpService.getI18n("unm.report.type.board");
        break;
      case 'ne':
        this.config = NEConfig;
        this.statisticKey = 'neList';
        this.typeLabel = this.reportHttpService.getI18n("unm.report.type.ne");
        break;
      case 'omodule':
        this.config = oModuleConfig;
        this.statisticKey = 'opticalModuleList';
        this.typeLabel = this.reportHttpService.getI18n("unm.report.type.omodule");
        break;
      case 'port':
        this.config = portConfig;
        this.statisticKey = 'portList';
        this.typeLabel = this.reportHttpService.getI18n("unm.report.type.port");
        break;
      case 'shelf':
        this.config = shelfConfig;
        this.statisticKey = 'boxList';
        this.typeLabel = this.reportHttpService.getI18n("unm.report.type.shelf");
        break;
      case 'slot':
        this.config = slotConfig;
        this.statisticKey = 'slotList';
        this.typeLabel = this.reportHttpService.getI18n("unm.report.type.slot");
        break;
      default:
        break;
    }
    // 初始化宽度
    if (this.isfull) {
      this.boxStyle.width = "950px";
    }
    // 初始化
    this.loadOptions();
  }

  ngAfterViewInit() {
    this.waf_chart = this.wafEchartComponent.getChart();
    // 获取data值之后初始化默认查询数据
    if (this.dataFields != null) {
      if (this.dataFields != "default") {
        this.statisticFields = this.dataFields
      }
      this.reloadStatistics();
    }
    // 点击跳转页面
    let that = this;
    this.waf_chart.on('click', function (params) {
      that.navigate();
    });
  }

  /**
   * 页面跳转
   */
  navigate() {
    let menuItem;
    switch (this.type) {
      case "ne":
        menuItem = this.tpiService.getMenuItem(20300000100)
        break;
      case "board":
        menuItem = this.tpiService.getMenuItem(20300000103);
        break;
      case "port":
        menuItem = this.tpiService.getMenuItem(20300000104);
        break;
      case "shelf":
        menuItem = this.tpiService.getMenuItem(20300000101);
        break;
      case "slot":
        menuItem = this.tpiService.getMenuItem(20300000102);
        break;
      case "omodule":
        menuItem = this.tpiService.getMenuItem(20300000105);
        break;
      default:
        break;
    }
    // 过滤状态传递
    menuItem.pathParam = this.statisticFields;
    this.router.navigate(menuItem);
  }

  /**
   * 刷新统计数据
   */
  reloadStatistics() {
    this.reportHttpService.openStatistics(this.type, this.statisticFields, (res) => {
      // res ws推送数据

      this.chartData = this.reportHttpService.getFormatedResult(res.body);

      this.writeStatisticData();

      this.chartsChange('bar');
    });
  }

  // 统计数据显示格式化
  writeStatisticData() {
    let _data = [];
    let _name = [];
    let dataIndex = this.statisticColIndex + this.statisticFields.length;
    for (let i = 0; i < this.chartData.data.length; i++) {
      const element = this.chartData.data[i];
      let s = "";
      // 多选统计维度时合并统计维度字符串
      for (let j = 0; j < this.statisticFields.length; j++) {
        if (j === 0) {
          s += String(element[j]);
        } else {
          s += "-" + String(element[j]);
        }
      }
      _name.push(s);
      _data.push(Number(element[dataIndex]));
    }
    // 设置图形数据
    this.chartsOption0.xAxis[0].data = _name;
    this.chartsOption0.series[0].data = _data;
    // 设置饼图数据
    let a = [];
    for (let k = 0; k < _data.length; k++) {
      const element = { value: 0, name: '', color: "" };
      element.value = Number(_data[k]);
      element.name = String(_name[k]);
      const _i = k % this.topsNum;
      element.color = colors[_i];
      a.push(element);
    }
    this.chartsOption1.series[0].data = a;
    this.tops = this.reportHttpService.orderTopN(a, this.topsNum);
  }

  /**
   * 初始化控件绑定
   */
  private loadOptions() {
    // 统计维度下拉框
    this.statisticFieldsOptions = this.config.statisticFieldsOptions;
    const children2 = [];
    for (let i = 0; i < this.statisticFieldsOptions.length; i++) {
      const element = this.statisticFieldsOptions[i];
      if (element.checked) {
        children2.push(element.value)
      }
    }
    this.statisticFields = children2;

    // 设置统计图显示的数据列，只能显示一列
    for (let index = 0; index < this.config.statisticCols.length; index++) {
      const element = this.config.statisticCols[index];
      if (element.hidden === false) {
        this.statisticColIndex = index;
        this.chartsOption0.series[0].name = element.name;
        this.chartsOption1.series[0].name = element.name;
      }
    }
  }

  /**
   * 统计维度配置
   * @param value 当前选中项
   */
  statisticFieldsChange(value: string[], a, b): void {

    this.reloadStatistics();
  }

  /**
   * 切换统计图类型
   * @param type 目标类型
   */
  chartsChange(type) {
    if (type === 'bar') {
      this.eType = true;
      this.waf_chart.setOption(this.chartsOption0, { notMerge: true });
    } else {
      this.eType = false;
      this.waf_chart.setOption(this.chartsOption1, { notMerge: true });
    }
  }

}

