import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { WafEchartComponent } from '@waf_component/echarts';
import { UnmAlarmHttpService } from '../../service/unm-alarm-http.service';
/**
 * @export
 * @class AlarmLevelComponent
 */
@Component({
    templateUrl: './alarm-level.component.html',
    styleUrls: ['./alarm-level.component.scss']
})
export class AlarmLevelComponent implements AfterViewInit {
    @ViewChild(WafEchartComponent) wafEchartComponent: WafEchartComponent;

    waf_chart;
    almLevelStaticticData = {
        "total": NaN,
        "critical": NaN,
        "major": NaN,
        "minor": NaN,
        "warning": NaN,
    };

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
        this.almLevelStaticticData = {
            "total": NaN,
            "critical": NaN,
            "major": NaN,
            "minor": NaN,
            "warning": NaN,
        };
        this.alarmHttpService.getAlmLevelStaticticData().then(
            (value: any) => {
                console.log(value);
                this.waf_chart.hideLoading();
                if (value) {
                    this.almLevelStaticticData = value;
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
                formatter: "{b}: {c} ({d}%)"
            },
            series: [
                {
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['50%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        { value: this.almLevelStaticticData.critical, name: '紧急' },
                        { value: this.almLevelStaticticData.major, name: '主要' },
                        { value: this.almLevelStaticticData.minor, name: '次要' },
                        { value: this.almLevelStaticticData.warning, name: '提示' }
                    ]
                }
            ]
        };
        this.waf_chart.setOption(option);
    }

}

