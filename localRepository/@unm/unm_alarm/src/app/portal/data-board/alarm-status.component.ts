import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { WafEchartComponent } from '@waf_component/echarts';
import { UnmAlarmHttpService } from '../../service/unm-alarm-http.service';
/**
 * @export
 * @class AlarmStatusComponent
 */
@Component({
    templateUrl: './alarm-status.component.html',
    styleUrls: ['./alarm-status.component.scss']
})
export class AlarmStatusComponent implements AfterViewInit {
    @ViewChild(WafEchartComponent) wafEchartComponent: WafEchartComponent;

    waf_chart;
    almStatusStaticticData;
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
        this.almStatusStaticticData = {
            "total": NaN,
            "confirmClear": NaN,
            "unconfirmClear": NaN,
            "confirmUnclear": NaN,
            "unconfirmUnclear": NaN,
        };
        this.alarmHttpService.getAlmStatusStaticticData().then(
            (value) => {
                console.log(value);
                this.waf_chart.hideLoading();
                if (value) {
                    this.almStatusStaticticData = value;
                    this.refreshChart();
                }


            },
            (desc: string) => { console.log(desc) }
        );
    }
    refreshChart() {
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            legend: [{
                orient: 'horizontal',
                bottom: '10%',
                data: ['未确认未清除', '未确认已清除']
            },
            {
                orient: 'horizontal',
                bottom: '1%',
                data: ['已确认未清除', '已确认已清除']
            }],
            series: [
                {
                    type: 'pie',
                    radius: '70%',
                    center: ['50%', '50%'],
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    data: [{ value: this.almStatusStaticticData.unconfirmUnclear, name: '未确认未清除' },
                    { value: this.almStatusStaticticData.unconfirmClear, name: '未确认已清除' },
                    { value: this.almStatusStaticticData.confirmUnclear, name: '已确认未清除' },
                    { value: this.almStatusStaticticData.confirmClear, name: '已确认已清除' }],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        this.waf_chart.setOption(option);

    }
}


