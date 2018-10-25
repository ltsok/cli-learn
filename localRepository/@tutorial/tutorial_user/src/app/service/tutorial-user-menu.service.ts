import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem, TpiMenuItemType } from '@waf_service/tpi';

/**
 * tutorial_management菜单服务
 * @export
 * @class TutorialUserMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class TutorialUserMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems:TpiMenuItem[] = [];

    // 主导航-一级菜单：用户管理
    let menuItem = new TpiMenuItem();
    menuItem.id = 307;
    menuItem.isHide = true;
    menuItem.name = 'tutorial.user';
    menuItem.icon = '';
    menuItems.push(menuItem);

    // 主导航-二级菜单：用户查询
    let queryMenuItem = new TpiMenuItem();
    queryMenuItem.id = 30700;
    queryMenuItem.isHide = true;
    queryMenuItem.name = 'tutorial.user.query';
    queryMenuItem.icon = '';
    queryMenuItem.parentId = menuItem.id;
    menuItems.push(queryMenuItem);

    // 主导航-三级菜单：个人信息
    let personalMenuItem = new TpiMenuItem();
    personalMenuItem.id = 3070000;
    personalMenuItem.type.isShortcut = true;
    personalMenuItem.name = 'tutorial.user.query.personal-information';
    personalMenuItem.icon = 'fh-info';
    personalMenuItem.path = '/tutorial-user/user-query/personal-information';
    personalMenuItem.parentId = queryMenuItem.id;
    menuItems.push(personalMenuItem);

    // 主导航-三级菜单：用户列表
    let userListMenuItem = new TpiMenuItem();
    userListMenuItem.id = 3070001;
    userListMenuItem.type.isShortcut = true;
    userListMenuItem.name = 'tutorial.user.query.user-list';
    userListMenuItem.icon = 'fh-list';
    userListMenuItem.path = '/tutorial-user/user-query/user-list';
    userListMenuItem.parentId = queryMenuItem.id;
    menuItems.push(userListMenuItem);

    // 主导航-二级菜单：用户操作
    let operationMenuItem = new TpiMenuItem();
    operationMenuItem.id = 30701;
    operationMenuItem.isHide = true;
    operationMenuItem.name = 'tutorial.user.operation';
    operationMenuItem.icon = '';
    operationMenuItem.parentId = menuItem.id;
    menuItems.push(operationMenuItem);

    // 主导航-三级菜单：新增用户
    let userAddMenuItem = new TpiMenuItem();
    userAddMenuItem.id = 3070100;
    userAddMenuItem.type.isShortcut = true;
    userAddMenuItem.name = 'tutorial.user.operation.user-add';
    userAddMenuItem.icon = 'fh-add';
    userAddMenuItem.path = '/tutorial-user/user-operation/user-add';
    userAddMenuItem.parentId = operationMenuItem.id;
    menuItems.push(userAddMenuItem);

    // 主导航-三级菜单：权限分配
    let authMenuItem = new TpiMenuItem();
    authMenuItem.id = 3070101;
    authMenuItem.type.isShortcut = true;
    authMenuItem.name = 'tutorial.user.operation.auth-distribution';
    authMenuItem.icon = 'fh-auth';
    authMenuItem.path = '/tutorial-user/user-operation/auth-distribution';
    authMenuItem.parentId = operationMenuItem.id;
    menuItems.push(authMenuItem);

    // 主导航-三级菜单：系统操作
    let systemMenuItem = new TpiMenuItem();
    systemMenuItem.id = 3070102;
    systemMenuItem.type.isShortcut = true;
    systemMenuItem.name = 'tutorial.user.operation.system-operation';
    systemMenuItem.icon = 'fh-settings';
    systemMenuItem.path = '/tutorial-user/user-operation/system-operation';
    systemMenuItem.parentId = operationMenuItem.id;
    menuItems.push(systemMenuItem);

    // 主导航-二级菜单：用户提醒
    let remindMenuItem = new TpiMenuItem();
    remindMenuItem.id = 30702;
    remindMenuItem.isHide = true;
    remindMenuItem.name = 'tutorial.user.remind';
    remindMenuItem.icon = '';
    remindMenuItem.parentId = menuItem.id;
    menuItems.push(remindMenuItem);

    // 主导航-三级菜单：消息提醒
    let msgRemindMenuItem = new TpiMenuItem();
    msgRemindMenuItem.id = 3070200;
    msgRemindMenuItem.type.isSupervisory = true;
    msgRemindMenuItem.name = 'tutorial.user.remind.msg-remind';
    msgRemindMenuItem.icon = 'fh-remind';
    msgRemindMenuItem.path = '/tutorial-user/user-remind/msg-remind';
    msgRemindMenuItem.parentId = remindMenuItem.id;
    menuItems.push(msgRemindMenuItem);

    return menuItems;
  }
}
