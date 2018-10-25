import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem, TpiMenuItemType } from '@waf_service/tpi';

/**
 * unm_ne_manager菜单服务
 * @export
 * @class UnmNeManagerMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class UnmNeManagerMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems: TpiMenuItem[] = [];

    // 主导航-三级菜单：网元管理器
    let neManagerItem = new TpiMenuItem();
    neManagerItem.id = 20001;
    neManagerItem.name = 'unm.topo.net_manager';
    neManagerItem.icon = '';
    neManagerItem.isHide = true;
    neManagerItem.parentId = 200;
    menuItems.push(neManagerItem);

    // 左侧-一级菜单：网元总览
    let neOverviewItem = new TpiMenuItem();
    neOverviewItem.id = 2000100;
    neOverviewItem.name = 'unm.ne.overview';
    neOverviewItem.icon = '';
    neOverviewItem.path = '/unm-ne-manager';
    neOverviewItem.parentId = neManagerItem.id;
    // neOverviewItem.linkId = 200010000;
    menuItems.push(neOverviewItem);

    //左侧-二级菜单：设备框视图
    let boxItem = new TpiMenuItem();
    boxItem.id = 200010000;
    boxItem.name = 'unm.ne.box';
    boxItem.icon = '';
    boxItem.path = '/unm-ne-manager/box';
    boxItem.parentId = neOverviewItem.id;
    menuItems.push(boxItem);

    //左侧-二级菜单：当前告警
    let alarmItem = new TpiMenuItem();
    alarmItem.id = 200010001;
    alarmItem.name = 'unm.ne.alarm';
    alarmItem.icon = '';
    alarmItem.path = '/unm-alarm/query/alarm-current';
    alarmItem.parentId = neOverviewItem.id;
    menuItems.push(alarmItem);

    //左侧-二级菜单：当前性能
    let performanceItem = new TpiMenuItem();
    performanceItem.id = 200010002;
    performanceItem.name = 'unm.ne.performance';
    performanceItem.icon = '';
    performanceItem.path = '/unm-pm/query/pm-current';
    performanceItem.parentId = neOverviewItem.id;
    menuItems.push(performanceItem);

    //左侧-二级菜单：历史性能
    let oldPerformanceItem = new TpiMenuItem();
    oldPerformanceItem.id = 200010003;
    oldPerformanceItem.name = 'unm.ne.old_performance';
    oldPerformanceItem.icon = '';
    oldPerformanceItem.path = '/unm-pm/query/pm-history';
    oldPerformanceItem.parentId = neOverviewItem.id;
    menuItems.push(oldPerformanceItem);

    return menuItems;
  }
}
