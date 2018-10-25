import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { WafEchartComponent } from '@waf_component/echarts';
import { UnmAlarmHttpService } from '../../service/unm-alarm-http.service';
/**
 * @export
 * @class AlarmTypeComponent
 */
@Component({
    templateUrl: './alarm-type.component.html',
    styleUrls: ['./alarm-type.component.scss']
})
export class AlarmTypeComponent implements AfterViewInit {
    @ViewChild(WafEchartComponent) wafEchartComponent: WafEchartComponent;

    waf_chart;
    almTypeStaticticData: AlmTypeStaticticData = new AlmTypeStaticticData();
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
        let data = {
            "total": NaN,
            "communication": NaN,
            "environment": NaN,
            "device": NaN,
            "business": NaN,
            "mulpulate": NaN,
            "security": NaN,
        };
        this.convertData(data);
        this.alarmHttpService.getAlmTypeStaticticData().then(
            (value: any) => {
                console.log(value);
                if (value) {
                    this.convertData(value);
                    this.refreshChart();
                }
                this.waf_chart.hideLoading();
            },
            (desc: string) => { console.log(desc) }
        );
    }

    refreshChart() {
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return params.value;
                }
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
                data: [
                    '安全告警 ' + this.almTypeStaticticData.securityPer,
                    '处理错误 ' + this.almTypeStaticticData.mulpulatePer,
                    '服务质量 ' + this.almTypeStaticticData.businessPer,
                    '设备故障 ' + this.almTypeStaticticData.devicePer,
                    '环境告警 ' + this.almTypeStaticticData.environmentPer,
                    '通信质量 ' + this.almTypeStaticticData.communicationPer],
            },
            series: [
                {
                    barWidth: 5,
                    data: [this.almTypeStaticticData.security,
                    this.almTypeStaticticData.mulpulate,
                    this.almTypeStaticticData.business,
                    this.almTypeStaticticData.device,
                    this.almTypeStaticticData.environment,
                    this.almTypeStaticticData.communication],
                    type: 'bar'
                }
            ],
            axisLabel: [{
                align: 'left'
            }],
            grid: [{ // 控制图的大小，调整下面这些值就可以，
                left: '35%'
            }]
        };
        this.waf_chart.setOption(option);
    }
    convertData(data) {
        this.almTypeStaticticData.total = data.total;
        this.almTypeStaticticData.communication = data.communication;
        this.almTypeStaticticData.environment = data.environment;
        this.almTypeStaticticData.device = data.device;
        this.almTypeStaticticData.business = data.business;
        this.almTypeStaticticData.mulpulate = data.mulpulate;
        this.almTypeStaticticData.security = data.security;

        this.almTypeStaticticData.communicationPer = Math.round((data.communication / data.total) * 10000) / 100 + "%";
        this.almTypeStaticticData.environmentPer = Math.round((data.environment / data.total) * 10000) / 100 + "%";
        this.almTypeStaticticData.devicePer = Math.round((data.device / data.total) * 10000) / 100 + "%";
        this.almTypeStaticticData.businessPer = Math.round((data.business / data.total) * 10000) / 100 + "%";
        this.almTypeStaticticData.mulpulatePer = Math.round((data.mulpulate / data.total) * 10000) / 100 + "%";
        this.almTypeStaticticData.securityPer = Math.round((data.security / data.total) * 10000) / 100 + "%";
    }

}

export class AlmTypeStaticticData {
    //后台返回数据包含属性
    total: number;
    communication: number;
    environment: number;
    device: number;
    business: number;
    mulpulate: number;
    security: number;
    //前台展示新增属性
    communicationPer: string;
    environmentPer: string;
    devicePer: string;
    businessPer: string;
    mulpulatePer: string;
    securityPer: string;
}
