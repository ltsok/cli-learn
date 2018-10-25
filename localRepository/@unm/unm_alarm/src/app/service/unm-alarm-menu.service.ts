import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem } from '@waf_service/tpi';
import { AlarmStatisticsComponent } from '../portal/main-board/alarm-statistics/alarm-statistics.component';
import { AlarmLinkLostComponent } from '../portal/main-board/alarm-link-lost/alarm-link-lost.component';
import { AlarmLinkAlertComponent } from '../portal/main-board/alarm-link-alert/alarm-link-alert.component';

/**
 * unm_alarm菜单服务
 * @export
 * @class UnmAlarmMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class UnmAlarmMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems: TpiMenuItem[] = [];

    // 主导航-一级菜单：告警
    let menuItem = new TpiMenuItem();
    menuItem.id = 201;
    menuItem.name = 'unm.alarm';
    menuItem.icon = '';
    menuItem.linkId = 2010000;
    menuItems.push(menuItem);

    // 主导航-二级菜单：告警查询
    let queryMenuItem = new TpiMenuItem();
    queryMenuItem.id = 20100;
    queryMenuItem.name = 'unm.alarm.query';
    queryMenuItem.icon = '';
    queryMenuItem.parentId = menuItem.id;
    menuItems.push(queryMenuItem);

    // 主导航-二级菜单：全局告警板
    let boardMenuItem = new TpiMenuItem();
    boardMenuItem.id = 20101;
    boardMenuItem.isHide = true;
    boardMenuItem.name = 'unm.alarm.board';
    boardMenuItem.icon = '';
    boardMenuItem.parentId = menuItem.id;
    menuItems.push(boardMenuItem);

    // 主导航-三级菜单：当前告警
    let queryCurrentMenuItem = new TpiMenuItem();
    queryCurrentMenuItem.id = 2010000;
    queryCurrentMenuItem.name = 'unm.alarm.query.current';
    queryCurrentMenuItem.icon = '';
    queryCurrentMenuItem.path = '/unm-alarm/query/alarm-current';
    queryCurrentMenuItem.type.isResidentPage = true;
    queryCurrentMenuItem.parentId = queryMenuItem.id;
    menuItems.push(queryCurrentMenuItem);

    // 主导航-三级菜单：历史告警
    let queryHistoryMenuItem = new TpiMenuItem();
    queryHistoryMenuItem.id = 2010001;
    queryHistoryMenuItem.name = 'unm.alarm.query.history';
    queryHistoryMenuItem.icon = '';
    queryHistoryMenuItem.path = '/unm-alarm/query/alarm-history';
    queryHistoryMenuItem.parentId = queryMenuItem.id;
    menuItems.push(queryHistoryMenuItem);

    // 主导航-三级菜单：重点告警
    let boardFocalMenuItem = new TpiMenuItem();
    boardFocalMenuItem.id = 2010100;
    boardFocalMenuItem.name = 'unm.alarm.board.focal';
    boardFocalMenuItem.icon = 'fh-yuan';
    boardFocalMenuItem.secondaryIcon = 'fh-zhudaohanggaojing';
    boardFocalMenuItem.type.isSupervisory = true;
    boardFocalMenuItem.svGroupNo = 1;
    boardFocalMenuItem.path = '/unm-alarm/board/alarm-focal';
    boardFocalMenuItem.parentId = boardMenuItem.id;
    boardFocalMenuItem.param = { iconColor: '#FFFFFF', secondaryIconColor: '#00BDBD' };
    menuItems.push(boardFocalMenuItem);

    // 主导航-三级菜单：紧急告警
    let boardCriticalMenuItem = new TpiMenuItem();
    boardCriticalMenuItem.id = 2010101;
    boardCriticalMenuItem.name = 'unm.alarm.board.critical';
    boardCriticalMenuItem.icon = 'fh-yuan';
    boardCriticalMenuItem.secondaryIcon = 'fh-zhudaohanggaojingjinji';
    boardCriticalMenuItem.type.isSupervisory = true;
    boardCriticalMenuItem.svGroupNo = 1;
    boardCriticalMenuItem.path = '/unm-alarm/board/alarm-critical';
    boardCriticalMenuItem.parentId = boardMenuItem.id;
    boardCriticalMenuItem.param = { iconColor: '#FFFFFF', secondaryIconColor: '#F46E84' };
    menuItems.push(boardCriticalMenuItem);

    // 主导航-三级菜单：主要告警
    let boardMajorMenuItem = new TpiMenuItem();
    boardMajorMenuItem.id = 2010102;
    boardMajorMenuItem.name = 'unm.alarm.board.major';
    boardMajorMenuItem.icon = 'fh-yuan';
    boardMajorMenuItem.secondaryIcon = 'fh-zhudaohanggaojinghuangse';
    boardMajorMenuItem.type.isSupervisory = true;
    boardMajorMenuItem.svGroupNo = 1;
    boardMajorMenuItem.path = '/unm-alarm/board/alarm-major';
    boardMajorMenuItem.parentId = boardMenuItem.id;
    boardMajorMenuItem.param = { iconColor: '#FFFFFF', secondaryIconColor: '#F49A6E' };
    menuItems.push(boardMajorMenuItem);

    // 主导航-三级菜单：次要告警
    let boardMinorMenuItem = new TpiMenuItem();
    boardMinorMenuItem.id = 2010103;
    boardMinorMenuItem.name = 'unm.alarm.board.minor';
    boardMinorMenuItem.icon = 'fh-yuan';
    boardMinorMenuItem.secondaryIcon = 'fh-zhudaohanggaojinghuangse';
    boardMinorMenuItem.type.isSupervisory = true;
    boardMinorMenuItem.svGroupNo = 1;
    boardMinorMenuItem.path = '/unm-alarm/board/alarm-minor';
    boardMinorMenuItem.parentId = boardMenuItem.id;
    boardMinorMenuItem.param = { iconColor: '#FFFFFF', secondaryIconColor: '#F4CD6E' };
    menuItems.push(boardMinorMenuItem);

    // 主导航-三级菜单：提示告警
    let boardSuggestiveMenuItem = new TpiMenuItem();
    boardSuggestiveMenuItem.id = 2010104;
    boardSuggestiveMenuItem.name = 'unm.alarm.board.suggestive';
    boardSuggestiveMenuItem.icon = 'fh-yuan';
    boardSuggestiveMenuItem.secondaryIcon = 'fh-zhudaohanggaojinglanse';
    boardSuggestiveMenuItem.type.isSupervisory = true;
    boardSuggestiveMenuItem.svGroupNo = 1;
    boardSuggestiveMenuItem.path = '/unm-alarm/board/alarm-suggestive';
    boardSuggestiveMenuItem.parentId = boardMenuItem.id;
    boardSuggestiveMenuItem.param = { iconColor: '#FFFFFF', secondaryIconColor: '#6EA7F4' };
    menuItems.push(boardSuggestiveMenuItem);

    // 主导航-三级菜单：告警统计
    let boardStatisticsMenuItem = new TpiMenuItem();
    boardStatisticsMenuItem.id = 2010105;
    boardStatisticsMenuItem.isHide = true;
    boardStatisticsMenuItem.name = 'unm.alarm.board.statistics';
    boardStatisticsMenuItem.icon = 'fh-zhudaohanggaojingzhankaizhedie';
    boardStatisticsMenuItem.type.isSupervisory = true;
    boardStatisticsMenuItem.svGroupNo = 1;
    boardStatisticsMenuItem.component = AlarmStatisticsComponent;
    boardStatisticsMenuItem.parentId = boardMenuItem.id;
    boardStatisticsMenuItem.param = { iconColor: '#FFFFFF' };
    menuItems.push(boardStatisticsMenuItem);

    // 主导航-三级菜单：中断连纤
    let boardLinkLostMenuItem = new TpiMenuItem();
    boardLinkLostMenuItem.id = 2010106;
    boardLinkLostMenuItem.isHide = true;
    boardLinkLostMenuItem.name = 'unm.alarm.board.link.lost';
    boardLinkLostMenuItem.icon = 'fh-zhudaohanglianxiangaojinghongse';
    boardLinkLostMenuItem.type.isSupervisory = true;
    boardLinkLostMenuItem.svGroupNo = 2;
    boardLinkLostMenuItem.component = AlarmLinkLostComponent;
    boardLinkLostMenuItem.parentId = boardMenuItem.id;
    boardLinkLostMenuItem.param = { iconColor: '#FF0000' };
    menuItems.push(boardLinkLostMenuItem);

    // 主导航-三级菜单：预警连纤
    let boardLinkAlertMenuItem = new TpiMenuItem();
    boardLinkAlertMenuItem.id = 2010107;
    boardLinkAlertMenuItem.isHide = true;
    boardLinkAlertMenuItem.name = 'unm.alarm.board.link.alert';
    boardLinkAlertMenuItem.icon = 'fh-zhudaohanglianxiangaojinghongse';
    boardLinkAlertMenuItem.type.isSupervisory = true;
    boardLinkAlertMenuItem.svGroupNo = 2;
    boardLinkAlertMenuItem.component = AlarmLinkAlertComponent;
    boardLinkAlertMenuItem.parentId = boardMenuItem.id;
    boardLinkAlertMenuItem.param = { iconColor: '#FF9933' };
    menuItems.push(boardLinkAlertMenuItem);

    return menuItems;
  }
}
