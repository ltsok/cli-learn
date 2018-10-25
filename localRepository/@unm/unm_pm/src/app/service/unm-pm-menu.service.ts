import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem, TpiMenuItemType } from '@waf_service/tpi';

/**
 * unm_pm菜单服务
 * @export
 * @class UnmPmMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class UnmPmMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems: TpiMenuItem[] = [];

    // 主导航-一级菜单：性能
    let menuItem = new TpiMenuItem();
    menuItem.id = 202;
    menuItem.name = 'unm.pm';
    menuItem.icon = '';
    menuItem.linkId = 2020001;
    menuItems.push(menuItem);

    // 主导航-二级菜单：性能查询
    let queryMenuItem = new TpiMenuItem();
    queryMenuItem.id = 20200;
    queryMenuItem.name = 'unm.pm.query';
    queryMenuItem.icon = '';
    queryMenuItem.parentId = menuItem.id;
    menuItems.push(queryMenuItem);

    // 主导航-三级菜单：当前性能
    let queryCurrentMenuItem = new TpiMenuItem();
    queryCurrentMenuItem.id = 2020000;
    queryCurrentMenuItem.name = 'unm.pm.query.current';
    queryCurrentMenuItem.icon = '';
    queryCurrentMenuItem.path = '/unm-pm/query/pm-current';
    queryCurrentMenuItem.parentId = queryMenuItem.id;
    menuItems.push(queryCurrentMenuItem);

    // 主导航-三级菜单：历史性能
    let queryHistoryMenuItem = new TpiMenuItem();
    queryHistoryMenuItem.id = 2020001;
    queryHistoryMenuItem.name = 'unm.pm.query.history';
    queryHistoryMenuItem.icon = '';
    queryHistoryMenuItem.path = '/unm-pm/query/pm-history';
    queryHistoryMenuItem.parentId = queryMenuItem.id;
    menuItems.push(queryHistoryMenuItem);

    // 主导航-三级菜单：性能查询模板
    let queryTemplateMenuItem = new TpiMenuItem();
    queryTemplateMenuItem.id = 2020002;
    queryTemplateMenuItem.name = 'unm.pm.query.template';
    queryTemplateMenuItem.icon = '';
    queryTemplateMenuItem.path = '/unm-pm/query/pm-template';
    queryTemplateMenuItem.parentId = queryMenuItem.id;
    menuItems.push(queryTemplateMenuItem);

    // 主导航-二级菜单：性能分析
    let analysisMenuItem = new TpiMenuItem();
    analysisMenuItem.id = 20201;
    analysisMenuItem.name = 'unm.pm.analysis';
    analysisMenuItem.icon = '';
    analysisMenuItem.parentId = menuItem.id;
    menuItems.push(analysisMenuItem);

    // 主导航-三级菜单：性能查询模板
    let analysisTendencyMenuItem = new TpiMenuItem();
    analysisTendencyMenuItem.id = 2020100;
    analysisTendencyMenuItem.name = 'unm.pm.analysis.tendency';
    analysisTendencyMenuItem.icon = '';
    analysisTendencyMenuItem.path = '/unm-pm/analysis/pm-tendency';
    analysisTendencyMenuItem.parentId = analysisMenuItem.id;
    menuItems.push(analysisTendencyMenuItem);

    return menuItems;
  }
}
