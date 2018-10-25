import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem } from '@waf_service/tpi';

/**
 * tutorial_cli菜单服务
 * @export
 * @class TutorialCliMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class TutorialCliMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems:TpiMenuItem[] = [];

    // 主导航-一级菜单：命令行教程
    let menuItem = new TpiMenuItem();
    menuItem.id = 303;
    menuItem.name = 'tutorial.cli';
    menuItem.icon = '';
    menuItems.push(menuItem);

    // 主导航-二级菜单：设计简介
    let clidesignMenuItem = new TpiMenuItem();
    clidesignMenuItem.id = 30300;
    clidesignMenuItem.name = 'tutorial.cli.clidesign';
    clidesignMenuItem.icon = '';
    clidesignMenuItem.parentId = menuItem.id;
    menuItems.push(clidesignMenuItem);

    // 主导航-三级菜单：命令行设计思想
    let cliThoughtMenuItem = new TpiMenuItem();
    cliThoughtMenuItem.id = 3030000;
    cliThoughtMenuItem.name = 'tutorial.cli.clidesign.cliThought';
    cliThoughtMenuItem.icon = '';
    cliThoughtMenuItem.path = '/tutorial-cli/cli-design/cli-thought';
    cliThoughtMenuItem.parentId = clidesignMenuItem.id;
    menuItems.push(cliThoughtMenuItem);

    // 主导航-二级菜单：命令行使用
    let cliusageMenuItem = new TpiMenuItem();
    cliusageMenuItem.id = 30301;
    cliusageMenuItem.name = 'tutorial.cli.cliusage';
    cliusageMenuItem.icon = '';
    cliusageMenuItem.parentId = menuItem.id;
    menuItems.push(cliusageMenuItem);

    // 主导航-三级菜单：环境命令
    let environmentMenuItem = new TpiMenuItem();
    environmentMenuItem.id = 3030100;
    environmentMenuItem.name = 'tutorial.cli.cliusage.environment';
    environmentMenuItem.icon = '';
    environmentMenuItem.linkId = 303010000;
    environmentMenuItem.parentId = cliusageMenuItem.id;
    menuItems.push(environmentMenuItem);

    //  主导航-四级菜单：init
    let initMenuItem = new TpiMenuItem();
    initMenuItem.id = 303010000;
    initMenuItem.name = 'tutorial.cli.cliusage.environment.init';
    initMenuItem.icon = '';
    initMenuItem.path = '/tutorial-cli/cli-usage/cli-environment/cli-init';
    initMenuItem.parentId = environmentMenuItem.id;
    menuItems.push(initMenuItem);

    //  主导航-四级菜单：reinit
    let reinitMenuItem = new TpiMenuItem();
    reinitMenuItem.id = 303010001;
    reinitMenuItem.name = 'tutorial.cli.cliusage.environment.reinit';
    reinitMenuItem.icon = '';
    reinitMenuItem.path = '/tutorial-cli/cli-usage/cli-environment/cli-reinit';
    reinitMenuItem.parentId = environmentMenuItem.id;
    menuItems.push(reinitMenuItem);

    //  主导航-四级菜单：install
    let installMenuItem = new TpiMenuItem();
    installMenuItem.id = 303010002;
    installMenuItem.name = 'tutorial.cli.cliusage.environment.install';
    installMenuItem.icon = '';
    installMenuItem.path = '/tutorial-cli/cli-usage/cli-environment/cli-install';
    installMenuItem.parentId = environmentMenuItem.id;
    menuItems.push(installMenuItem);

    //  主导航-四级菜单：update
    let updateMenuItem = new TpiMenuItem();
    updateMenuItem.id = 303010003;
    updateMenuItem.name = 'tutorial.cli.cliusage.environment.update';
    updateMenuItem.icon = '';
    updateMenuItem.path = '/tutorial-cli/cli-usage/cli-environment/cli-update';
    updateMenuItem.parentId = environmentMenuItem.id;
    menuItems.push(updateMenuItem);

    //  主导航-四级菜单：upgrade
    let upgradeMenuItem = new TpiMenuItem();
    upgradeMenuItem.id = 303010004;
    upgradeMenuItem.name = 'tutorial.cli.cliusage.environment.upgrade';
    upgradeMenuItem.icon = '';
    upgradeMenuItem.path = '/tutorial-cli/cli-usage/cli-environment/cli-upgrade';
    upgradeMenuItem.parentId = environmentMenuItem.id;
    menuItems.push(upgradeMenuItem);

    //  主导航-四级菜单：ls
    let lsMenuItem = new TpiMenuItem();
    lsMenuItem.id = 303010100;
    lsMenuItem.name = 'tutorial.cli.cliusage.environment.ls';
    lsMenuItem.icon = '';
    lsMenuItem.path = '/tutorial-cli/cli-usage/cli-environment/cli-ls';
    lsMenuItem.parentId = environmentMenuItem.id;
    menuItems.push(lsMenuItem);

    // 主导航-三级菜单：骨架命令
    let skeletonMenuItem = new TpiMenuItem();
    skeletonMenuItem.id = 3030101;
    skeletonMenuItem.name = 'tutorial.cli.cliusage.skeleton';
    skeletonMenuItem.icon = '';
    skeletonMenuItem.linkId = 303010101;
    skeletonMenuItem.parentId = cliusageMenuItem.id;
    menuItems.push(skeletonMenuItem);

    // 主导航-四级菜单：new
    let newMenuItem = new TpiMenuItem();
    newMenuItem.id = 303010101;
    newMenuItem.name = 'tutorial.cli.cliusage.skeleton.new';
    newMenuItem.icon = '';
    newMenuItem.path = '/tutorial-cli/cli-usage/cli-skeleton/cli-new';
    newMenuItem.parentId = skeletonMenuItem.id
    menuItems.push(newMenuItem);

    // 主导航-四级菜单：page
    let pageMenuItem = new TpiMenuItem();
    pageMenuItem.id = 303010102;
    pageMenuItem.name = 'tutorial.cli.cliusage.skeleton.page';
    pageMenuItem.icon = '';
    pageMenuItem.path = '/tutorial-cli/cli-usage/cli-skeleton/cli-page';
    pageMenuItem.parentId = skeletonMenuItem.id
    menuItems.push(pageMenuItem);

    // 主导航-三级菜单：构建/归档命令
    let buildfileMenuItem = new TpiMenuItem();
    buildfileMenuItem.id = 3030102;
    buildfileMenuItem.name = 'tutorial.cli.cliusage.cli-build-file';
    buildfileMenuItem.icon = '';
    buildfileMenuItem.linkId = 303010201;
    buildfileMenuItem.parentId = cliusageMenuItem.id;
    menuItems.push(buildfileMenuItem);

    // 主导航-四级菜单：build
    let buildMenuItem = new TpiMenuItem();
    buildMenuItem.id = 303010200;
    buildMenuItem.name = 'tutorial.cli.cliusage.cli-build-file.build';
    buildMenuItem.icon = '';
    buildMenuItem.path = '/tutorial-cli/cli-usage/cli-build-file/cli-build';
    buildMenuItem.parentId = buildfileMenuItem.id;
    menuItems.push(buildMenuItem);

    // 主导航-四级菜单：serve
    let serveMenuItem = new TpiMenuItem();
    serveMenuItem.id = 303010201;
    serveMenuItem.name = 'tutorial.cli.cliusage.cli-build-file.serve';
    serveMenuItem.icon = '';
    serveMenuItem.path = '/tutorial-cli/cli-usage/cli-build-file/cli-serve';
    serveMenuItem.parentId = buildfileMenuItem.id;
    menuItems.push(serveMenuItem);

    // 主导航-四级菜单：publish
    let publishMenuItem = new TpiMenuItem();
    publishMenuItem.id = 303010202;
    publishMenuItem.name = 'tutorial.cli.cliusage.cli-build-file.publish';
    publishMenuItem.icon = '';
    publishMenuItem.path = '/tutorial-cli/cli-usage/cli-build-file/cli-publish';
    publishMenuItem.parentId = buildfileMenuItem.id;
    menuItems.push(publishMenuItem);

    // 主导航-四级菜单：unpublish
    let unpublishMenuItem = new TpiMenuItem();
    unpublishMenuItem.id = 303010203;
    unpublishMenuItem.name = 'tutorial.cli.cliusage.cli-build-file.unpublish';
    unpublishMenuItem.icon = '';
    unpublishMenuItem.path = '/tutorial-cli/cli-usage/cli-build-file/cli-unpublish';
    unpublishMenuItem.parentId = buildfileMenuItem.id;
    menuItems.push(unpublishMenuItem);

    return menuItems;
  }
}
