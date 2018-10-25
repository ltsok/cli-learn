import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem } from '@waf_service/tpi';

/**
 * unm_report菜单服务
 * @export
 * @class UnmReportMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class UnmReportMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems: TpiMenuItem[] = [];

    // 主导航-一级菜单：报表
    let menuItem = new TpiMenuItem();
    menuItem.id = 203;
    menuItem.name = 'unm.report';
    menuItem.icon = '';
    menuItem.linkId = 203000000;
    menuItems.push(menuItem);

    // 主导航-二级菜单：统计报表
    let statisticsMenuItem = new TpiMenuItem();
    statisticsMenuItem.id = 20300;
    statisticsMenuItem.name = 'unm.report.statistics';
    statisticsMenuItem.icon = '';
    statisticsMenuItem.parentId = menuItem.id;
    menuItems.push(statisticsMenuItem);

    // 主导航-三级菜单：资源报表
    let resourcesMenuItem = new TpiMenuItem();
    resourcesMenuItem.id = 2030000;
    resourcesMenuItem.name = 'unm.report.statistics.resources';
    resourcesMenuItem.icon = '';
    resourcesMenuItem.linkId = 203000000;
    resourcesMenuItem.parentId = statisticsMenuItem.id;
    menuItems.push(resourcesMenuItem);

    // 子导航-三级菜单：自定义报表
    let customMenuItem = new TpiMenuItem();
    customMenuItem.id = 2030001;
    customMenuItem.name = 'unm.report.custom';
    customMenuItem.icon = '';
    customMenuItem.path = '/unm-report/report-custom';
    customMenuItem.parentId = statisticsMenuItem.id;
    menuItems.push(customMenuItem);

    // 主导航-二级菜单：定时报表
    let timeMenuItem = new TpiMenuItem();
    timeMenuItem.id = 20301;
    timeMenuItem.name = 'unm.report.time';
    timeMenuItem.icon = '';
    timeMenuItem.parentId = menuItem.id;
    menuItems.push(timeMenuItem);

    // 主导航-三级菜单：性能任务报表
    let pmMenuItem = new TpiMenuItem();
    pmMenuItem.id = 2030100;
    pmMenuItem.name = 'unm.report.time.pm';
    pmMenuItem.icon = '';
    pmMenuItem.parentId = timeMenuItem.id;
    pmMenuItem.linkId = 203010000;
    menuItems.push(pmMenuItem);

    // ***************************************************************
    // 子导航-四级级菜单：全网资源分布
    let resourcesDistributionMenuItem = new TpiMenuItem();
    resourcesDistributionMenuItem.id = 203000000;
    resourcesDistributionMenuItem.name = 'unm.report.resources.distribution';
    resourcesDistributionMenuItem.icon = '';
    resourcesDistributionMenuItem.path = '/unm-report/resources/report-distribution';
    resourcesDistributionMenuItem.parentId = resourcesMenuItem.id;
    menuItems.push(resourcesDistributionMenuItem);

    // 子导航-四级级菜单：存量报表
    let resourcesStockMenuItem = new TpiMenuItem();
    resourcesStockMenuItem.id = 203000001;
    resourcesStockMenuItem.name = 'unm.report.resources.stock';
    resourcesStockMenuItem.icon = '';
    resourcesStockMenuItem.parentId = resourcesMenuItem.id;
    menuItems.push(resourcesStockMenuItem);

    // 子导航-五级级菜单：网元
    let resourcesStockNeMenuItem = new TpiMenuItem();
    resourcesStockNeMenuItem.id = 20300000100;
    resourcesStockNeMenuItem.name = 'unm.report.resources.stock.ne';
    resourcesStockNeMenuItem.icon = '';
    resourcesStockNeMenuItem.path = '/unm-report/resources/report-ne';
    resourcesStockNeMenuItem.parentId = resourcesStockMenuItem.id;
    menuItems.push(resourcesStockNeMenuItem);

    // 子导航-五级级菜单：机框
    let resourcesStockShelfMenuItem = new TpiMenuItem();
    resourcesStockShelfMenuItem.id = 20300000101;
    resourcesStockShelfMenuItem.name = 'unm.report.resources.stock.shelf';
    resourcesStockShelfMenuItem.icon = '';
    resourcesStockShelfMenuItem.path = '/unm-report/resources/report-shelf';
    resourcesStockShelfMenuItem.parentId = resourcesStockMenuItem.id;
    menuItems.push(resourcesStockShelfMenuItem);

    // 子导航-五级级菜单：槽位
    let resourcesStockSlotMenuItem = new TpiMenuItem();
    resourcesStockSlotMenuItem.id = 20300000102;
    resourcesStockSlotMenuItem.name = 'unm.report.resources.stock.slot';
    resourcesStockSlotMenuItem.icon = '';
    resourcesStockSlotMenuItem.path = '/unm-report/resources/report-slot';
    resourcesStockSlotMenuItem.parentId = resourcesStockMenuItem.id;
    menuItems.push(resourcesStockSlotMenuItem);

    // 子导航-五级级菜单：单盘
    let resourcesStockBoardMenuItem = new TpiMenuItem();
    resourcesStockBoardMenuItem.id = 20300000103;
    resourcesStockBoardMenuItem.name = 'unm.report.resources.stock.board';
    resourcesStockBoardMenuItem.icon = '';
    resourcesStockBoardMenuItem.path = '/unm-report/resources/report-board';
    resourcesStockBoardMenuItem.parentId = resourcesStockMenuItem.id;
    menuItems.push(resourcesStockBoardMenuItem);

    // 子导航-五级级菜单：端口
    let resourcesStockPortMenuItem = new TpiMenuItem();
    resourcesStockPortMenuItem.id = 20300000104;
    resourcesStockPortMenuItem.name = 'unm.report.resources.stock.port';
    resourcesStockPortMenuItem.icon = '';
    resourcesStockPortMenuItem.path = '/unm-report/resources/report-port';
    resourcesStockPortMenuItem.parentId = resourcesStockMenuItem.id;
    menuItems.push(resourcesStockPortMenuItem);

    // 子导航-五级级菜单：光模块
    let resourcesStockOpticalModuleMenuItem = new TpiMenuItem();
    resourcesStockOpticalModuleMenuItem.id = 20300000105;
    resourcesStockOpticalModuleMenuItem.name = 'unm.report.resources.stock.optical.module';
    resourcesStockOpticalModuleMenuItem.icon = '';
    resourcesStockOpticalModuleMenuItem.path = '/unm-report/resources/report-optical-module';
    resourcesStockOpticalModuleMenuItem.parentId = resourcesStockMenuItem.id;
    menuItems.push(resourcesStockOpticalModuleMenuItem);

    // 子导航-四级级菜单：15分钟历史性能统计
    let pm15mMenuItem = new TpiMenuItem();
    pm15mMenuItem.id = 203010000;
    pm15mMenuItem.name = 'unm.report.pm.15m.pm';
    pm15mMenuItem.icon = '';
    pm15mMenuItem.path = '/unm-report/pm/report-15m-pm';
    pm15mMenuItem.parentId = pmMenuItem.id;
    menuItems.push(pm15mMenuItem);

    // 子导航-四级级菜单：光功率性能统计
    let pmOpticalPowerMenuItem = new TpiMenuItem();
    pmOpticalPowerMenuItem.id = 203010001;
    pmOpticalPowerMenuItem.name = 'unm.report.pm.optical.power';
    pmOpticalPowerMenuItem.icon = '';
    pmOpticalPowerMenuItem.path = '/unm-report/pm/report-optical-power';
    pmOpticalPowerMenuItem.parentId = pmMenuItem.id;
    menuItems.push(pmOpticalPowerMenuItem);

    // 子导航-四级级菜单：误码率性能统计
    let pmErrorRateMenuItem = new TpiMenuItem();
    pmErrorRateMenuItem.id = 203010002;
    pmErrorRateMenuItem.name = 'unm.report.pm.error.rate';
    pmErrorRateMenuItem.icon = '';
    pmErrorRateMenuItem.path = '/unm-report/pm/report-error-rate';
    pmErrorRateMenuItem.parentId = pmMenuItem.id;
    menuItems.push(pmErrorRateMenuItem);

    // 子导航-四级级菜单：设备环境参数统计
    let pmEnvironmentMenuItem = new TpiMenuItem();
    pmEnvironmentMenuItem.id = 203010003;
    pmEnvironmentMenuItem.name = 'unm.report.pm.environment';
    pmEnvironmentMenuItem.icon = '';
    pmEnvironmentMenuItem.path = '/unm-report/pm/report-environment';
    pmEnvironmentMenuItem.parentId = pmMenuItem.id;
    menuItems.push(pmEnvironmentMenuItem);

    // 子导航-四级级菜单：网元CPU和内存占用统计
    let pmHardwareMenuItem = new TpiMenuItem();
    pmHardwareMenuItem.id = 203010004;
    pmHardwareMenuItem.name = 'unm.report.pm.hardware';
    pmHardwareMenuItem.icon = '';
    pmHardwareMenuItem.path = '/unm-report/pm/report-hardware';
    pmHardwareMenuItem.parentId = pmMenuItem.id;
    menuItems.push(pmHardwareMenuItem);

    return menuItems;
  }
}
