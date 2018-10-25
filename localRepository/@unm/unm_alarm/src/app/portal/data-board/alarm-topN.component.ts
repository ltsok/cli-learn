import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { WafEchartComponent } from '@waf_component/echarts';
import { UnmAlarmHttpService } from '../../service/unm-alarm-http.service';
/**
 * @export
 * @class AlarmTopNComponent
 */
@Component({
    templateUrl: './alarm-topN.component.html',
    styleUrls: ['./alarm-topN.component.scss']
})
export class AlarmTopNComponent implements AfterViewInit {
    @ViewChild(WafEchartComponent) wafEchartComponent: WafEchartComponent;

    waf_chart;
    neList = [];
    constructor(private alarmHttpService: UnmAlarmHttpService) {

    }
    ngAfterViewInit(): void {
        this.waf_chart = this.wafEchartComponent.getChart();
        this.refreshData();

    }

    refreshData() {
        this.waf_chart.showLoading({
            text: '加载中',
            color: 'blue',
            textColor: '#ffffff',
            maskColor: '#556989',
        }
        );
        this.alarmHttpService.getAlmTopNStaticticData().then(
            (value: any) => {
                console.log(value);
                if (value && value.top10Statistic) {
                    this.neList = value.top10Statistic;
                    this.refreshChart();
                }
                this.waf_chart.hideLoading();
            },
            (desc: string) => { console.log(desc) }
        );
    }

    refreshChart() {
        let yAxisData = [];
        let criticalData = [];
        let majorData = [];
        let minorData = [];
        let warningData = [];
        this.neList.reverse();
        this.neList.forEach(element => {
            yAxisData.push(element.neName);
            criticalData.push(element.statisticBean.critical);
            majorData.push(element.statisticBean.major);
            minorData.push(element.statisticBean.minor);
            warningData.push(element.statisticBean.warning);
        });
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a}: {c}"
            },
            xAxis: {
                type: 'value',
                show: false,
            },
            yAxis: {
                show: true,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                type: 'category',

                data: yAxisData
            },
            series: [
                {
                    name: '紧急',
                    type: 'bar',
                    barWidth: 5,
                    stack: '总量',
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: criticalData
                },
                {
                    name: '主要',
                    type: 'bar',
                    barWidth: 5,
                    stack: '总量',
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: majorData
                },
                {
                    name: '次要',
                    type: 'bar',
                    barWidth: 5,
                    stack: '总量',
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: minorData
                },
                {
                    name: '提示',
                    type: 'bar',
                    barWidth: 5,
                    stack: '总量',
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: warningData
                },
            ],

        };
        this.waf_chart.setOption(option);
    }
}


