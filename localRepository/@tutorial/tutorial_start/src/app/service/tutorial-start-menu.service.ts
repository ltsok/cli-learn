import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem, TpiMenuItemType } from '@waf_service/tpi';

/**
 * tutorial_start菜单服务
 * @export
 * @class TutorialStartMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class TutorialStartMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems: TpiMenuItem[] = [];

    // 主导航-一级菜单：入门教程
    let menuItem = new TpiMenuItem();
    menuItem.id = 300;
    menuItem.name = 'tutorial.start';
    menuItem.icon = '';
    menuItems.push(menuItem);

    // 主导航-二级菜单：系统准备
    let preparationMenuItem = new TpiMenuItem();
    preparationMenuItem.id = 30000;
    preparationMenuItem.name = 'tutorial.start.preparation';
    preparationMenuItem.icon = '';
    preparationMenuItem.parentId = menuItem.id;
    menuItems.push(preparationMenuItem);

    // 主导航-三级菜单：环境搭建
    let environmentMenuItem = new TpiMenuItem();
    environmentMenuItem.id = 3000000;
    environmentMenuItem.name = 'tutorial.start.preparation.environment';
    environmentMenuItem.icon = '';
    environmentMenuItem.path = '/tutorial-start/preparation/environment';
    environmentMenuItem.parentId = preparationMenuItem.id;
    menuItems.push(environmentMenuItem);

    // 主导航-三级菜单：常用命令
    let commonCommandsMenuItem = new TpiMenuItem();
    commonCommandsMenuItem.id = 3000001;
    commonCommandsMenuItem.name = 'tutorial.start.preparation.common.commands';
    commonCommandsMenuItem.icon = '';
    commonCommandsMenuItem.path = '/tutorial-start/preparation/common-commands';
    commonCommandsMenuItem.parentId = preparationMenuItem.id;
    menuItems.push(commonCommandsMenuItem);

    // 主导航-三级菜单：常见问题
    let commonProblemsMenuItem = new TpiMenuItem();
    commonProblemsMenuItem.id = 3000002;
    commonProblemsMenuItem.name = 'tutorial.start.preparation.common.problems';
    commonProblemsMenuItem.icon = '';
    commonProblemsMenuItem.path = '/tutorial-start/preparation/common-problems';
    commonProblemsMenuItem.parentId = preparationMenuItem.id;
    menuItems.push(commonProblemsMenuItem);

    // 主导航-二级菜单：系统规范
    let specificationMenuItem = new TpiMenuItem();
    specificationMenuItem.id = 30001;
    specificationMenuItem.name = 'tutorial.start.specification';
    specificationMenuItem.isHide = true;
    specificationMenuItem.icon = '';
    specificationMenuItem.parentId = menuItem.id;
    menuItems.push(specificationMenuItem);

    // 主导航-三级菜单：目录规范
    let folderMenuItem = new TpiMenuItem();
    folderMenuItem.id = 3000100;
    folderMenuItem.name = 'tutorial.start.specification.folder';
    folderMenuItem.icon = '';
    folderMenuItem.path = '/tutorial-start/specification/folder';
    folderMenuItem.parentId = specificationMenuItem.id;
    menuItems.push(folderMenuItem);

    // 主导航-三级菜单：命名规范
    let nameMenuItem = new TpiMenuItem();
    nameMenuItem.id = 3000101;
    nameMenuItem.name = 'tutorial.start.specification.name';
    nameMenuItem.icon = '';
    nameMenuItem.path = '/tutorial-start/specification/name';
    nameMenuItem.parentId = specificationMenuItem.id;
    menuItems.push(nameMenuItem);

    // 主导航-三级菜单：代码规范
    let codeMenuItem = new TpiMenuItem();
    codeMenuItem.id = 3000102;
    codeMenuItem.name = 'tutorial.start.specification.code';
    codeMenuItem.icon = '';
    codeMenuItem.path = '/tutorial-start/specification/code';
    codeMenuItem.parentId = specificationMenuItem.id;
    menuItems.push(codeMenuItem);

    // 主导航-二级菜单：系统扩展
    let extensionMenuItem = new TpiMenuItem();
    extensionMenuItem.id = 30002;
    extensionMenuItem.name = 'tutorial.start.extension';
    extensionMenuItem.icon = '';
    extensionMenuItem.parentId = menuItem.id;
    menuItems.push(extensionMenuItem);

    // 主导航-三级菜单：新增资源
    let resourceMenuItem = new TpiMenuItem();
    resourceMenuItem.id = 3000200;
    resourceMenuItem.name = 'tutorial.start.extension.resource';
    resourceMenuItem.icon = '';
    resourceMenuItem.linkId = 300020000;
    resourceMenuItem.parentId = extensionMenuItem.id;
    menuItems.push(resourceMenuItem);

    // 主导航-三级菜单：新增模块
    let moduleMenuItem = new TpiMenuItem();
    moduleMenuItem.id = 3000201;
    moduleMenuItem.name = 'tutorial.start.extension.module';
    moduleMenuItem.icon = '';
    moduleMenuItem.path = '/tutorial-start/extension/module';
    moduleMenuItem.parentId = extensionMenuItem.id;
    menuItems.push(moduleMenuItem);

    // 主导航-三级菜单：新增页面
    let pageMenuItem = new TpiMenuItem();
    pageMenuItem.id = 3000202;
    pageMenuItem.name = 'tutorial.start.extension.page';
    pageMenuItem.icon = '';
    pageMenuItem.path = '/tutorial-start/extension/page';
    pageMenuItem.parentId = extensionMenuItem.id;
    menuItems.push(pageMenuItem);

    // 主导航-三级菜单：新增全局样式
    let globalStyleMenuItem = new TpiMenuItem();
    globalStyleMenuItem.id = 3000203;
    globalStyleMenuItem.name = 'tutorial.start.extension.global.style';
    globalStyleMenuItem.icon = '';
    globalStyleMenuItem.path = '/tutorial-start/extension/global-style';
    globalStyleMenuItem.parentId = extensionMenuItem.id;
    menuItems.push(globalStyleMenuItem);

    // 主导航-三级菜单：新增第三方包
    let thirdPartyMenuItem = new TpiMenuItem();
    thirdPartyMenuItem.id = 3000204;
    thirdPartyMenuItem.name = 'tutorial.start.extension.third.party';
    thirdPartyMenuItem.icon = '';
    thirdPartyMenuItem.path = '/tutorial-start/extension/third-party';
    thirdPartyMenuItem.parentId = extensionMenuItem.id;
    menuItems.push(thirdPartyMenuItem);

    // ***************************************************************

    // 子导航-四级级菜单：新增国际化资源
    let resourceExtI18nMenuItem = new TpiMenuItem();
    resourceExtI18nMenuItem.id = 300020000;
    resourceExtI18nMenuItem.name = 'tutorial.start.extension.resource.ext.i18n';
    resourceExtI18nMenuItem.icon = '';
    resourceExtI18nMenuItem.path = '/tutorial-start/extension/resource/ext-i18n';
    resourceExtI18nMenuItem.parentId = resourceMenuItem.id;
    menuItems.push(resourceExtI18nMenuItem);

    // 子导航-四级级菜单：新增icon资源
    let resourceExtIconfontMenuItem = new TpiMenuItem();
    resourceExtIconfontMenuItem.id = 300020001;
    resourceExtIconfontMenuItem.name = 'tutorial.start.extension.resource.ext.iconfont';
    resourceExtIconfontMenuItem.icon = '';
    resourceExtIconfontMenuItem.path = '/tutorial-start/extension/resource/ext-iconfont';
    resourceExtIconfontMenuItem.parentId = resourceMenuItem.id;
    menuItems.push(resourceExtIconfontMenuItem);

    // 子导航-四级级菜单：新增模块资源
    let resourceExtModuleMenuItem = new TpiMenuItem();
    resourceExtModuleMenuItem.id = 300020002;
    resourceExtModuleMenuItem.name = 'tutorial.start.extension.resource.ext.module';
    resourceExtModuleMenuItem.icon = '';
    resourceExtModuleMenuItem.path = '/tutorial-start/extension/resource/ext-module';
    resourceExtModuleMenuItem.parentId = resourceMenuItem.id;
    menuItems.push(resourceExtModuleMenuItem);

    return menuItems;
  }
}
