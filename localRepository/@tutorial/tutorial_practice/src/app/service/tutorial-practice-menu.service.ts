import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem, TpiMenuItemType } from '@waf_service/tpi';

/**
 * tutorial_practice菜单服务
 * @export
 * @class TutorialPracticeMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class TutorialPracticeMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems:TpiMenuItem[] = [];

    // 主导航-一级菜单：产品实践
    let menuItem = new TpiMenuItem();
    menuItem.id = 306;
    menuItem.name = 'tutorial.practice';
    menuItem.icon = '';
    menuItems.push(menuItem);

    // 主导航-二级菜单：设计简介
    let practiceDesignMenuItem = new TpiMenuItem();
    practiceDesignMenuItem.id = 30600;
    practiceDesignMenuItem.name = 'tutorial.practice.practice-design';
    practiceDesignMenuItem.icon = '';
    practiceDesignMenuItem.parentId = menuItem.id;
    menuItems.push(practiceDesignMenuItem);

    //  主导航-三级菜单：产品实践设计思想
    let practiceThoughtMenuItem = new TpiMenuItem();
    practiceThoughtMenuItem.id = 3060000;
    practiceThoughtMenuItem.name = 'tutorial.practice.practice-design.practice-thought';
    practiceThoughtMenuItem.icon = '';
    practiceThoughtMenuItem.path = '/tutorial-practice/practice-design/practice-thought';
    practiceThoughtMenuItem.parentId = practiceDesignMenuItem.id;
    menuItems.push(practiceThoughtMenuItem);

    // 主导航-二级菜单：实践举例
    let practiceExampleMenuItem = new TpiMenuItem();
    practiceExampleMenuItem.id = 30601;
    practiceExampleMenuItem.name = 'tutorial.practice.practice-example';
    practiceExampleMenuItem.icon = '';
    practiceExampleMenuItem.parentId = menuItem.id;
    menuItems.push(practiceExampleMenuItem);

    // 主导航-三级菜单：web系统
    let systemWebMenuItem = new TpiMenuItem();
    systemWebMenuItem.id = 3060100;
    systemWebMenuItem.name = 'tutorial.practice.practice-example.system-web';
    systemWebMenuItem.icon = '';
    systemWebMenuItem.path = '/tutorial-practice/practice-example/system-web';
    systemWebMenuItem.parentId = practiceExampleMenuItem.id;
    menuItems.push(systemWebMenuItem);

    return menuItems;
  }
}
