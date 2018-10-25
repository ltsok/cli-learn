import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem, TpiMenuItemType } from '@waf_service/tpi';

/**
 * unm_settings菜单服务
 * @export
 * @class UnmSettingsMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class UnmSettingsMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems: TpiMenuItem[] = [];

    // 主导航-一级菜单：设置
    let menuItem = new TpiMenuItem();
    menuItem.id = 205;
    menuItem.name = 'unm.settings';
    menuItem.icon = '';
    menuItem.isHide = true;
    menuItems.push(menuItem);

    // 主导航-二级菜单：个人设置
    let individualMenuItem = new TpiMenuItem();
    individualMenuItem.id = 20500;
    individualMenuItem.name = 'unm.settings.individual';
    individualMenuItem.icon = '';
    individualMenuItem.parentId = menuItem.id;
    individualMenuItem.isHide = true;
    menuItems.push(individualMenuItem);

    // 主导航-三级菜单：设置（快捷导航）
    let settingsMenuItem = new TpiMenuItem();
    settingsMenuItem.id = 2050000;
    settingsMenuItem.name = 'unm.settings.individual.settings';
    settingsMenuItem.icon = 'fh-shezhi';
    settingsMenuItem.linkId = 205000000;
    settingsMenuItem.type.isShortcut = true;
    settingsMenuItem.parentId = individualMenuItem.id;
    menuItems.push(settingsMenuItem);

    // ***************************************************************
    // 子导航-四级级菜单：用户
    let individualSettingsUserMenuItem = new TpiMenuItem();
    individualSettingsUserMenuItem.id = 205000000;
    individualSettingsUserMenuItem.name = 'unm.settings.individual.user';
    individualSettingsUserMenuItem.icon = '';
    individualSettingsUserMenuItem.path = '/unm-settings/individual/settings-user';
    individualSettingsUserMenuItem.parentId = settingsMenuItem.id;
    menuItems.push(individualSettingsUserMenuItem);

    // 子导航-四级级菜单：告警
    let individualSettingsAlarmMenuItem = new TpiMenuItem();
    individualSettingsAlarmMenuItem.id = 205000001;
    individualSettingsAlarmMenuItem.name = 'unm.settings.individual.alarm';
    individualSettingsAlarmMenuItem.icon = '';
    individualSettingsAlarmMenuItem.path = '/unm-settings/individual/settings-alarm';
    individualSettingsAlarmMenuItem.parentId = settingsMenuItem.id;
    menuItems.push(individualSettingsAlarmMenuItem);

    return menuItems;
  }
}
