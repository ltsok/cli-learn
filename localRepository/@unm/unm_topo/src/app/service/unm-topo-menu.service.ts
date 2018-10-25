import { Injectable } from "@angular/core";
import { ITpiMenu, TpiMenuItem, TpiMenuItemType } from '@waf_service/tpi';

/**
 * unm_topo菜单服务
 * @export
 * @class UnmTopoMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class UnmTopoMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {

    // 待返回的菜单项数组
    let menuItems: TpiMenuItem[] = [];

    // 主导航-一级菜单：拓扑
    let menuItem = new TpiMenuItem();
    menuItem.id = 200;
    menuItem.name = 'unm.topo';
    menuItem.icon = '';
    menuItem.linkId = 2000000;
    menuItems.push(menuItem);

    // 主导航-二级菜单：网络拓扑
    let networkMenuItem = new TpiMenuItem();
    networkMenuItem.id = 20000;
    networkMenuItem.name = 'unm.topo.network';
    networkMenuItem.icon = '';
    networkMenuItem.parentId = menuItem.id;
    menuItems.push(networkMenuItem);

    // 主导航-三级菜单：物理拓扑
    let networkPhysicsMenuItem = new TpiMenuItem();
    networkPhysicsMenuItem.id = 2000000;
    networkPhysicsMenuItem.name = 'unm.topo.network.physics';
    networkPhysicsMenuItem.icon = '';
    networkPhysicsMenuItem.path = '/unm-topo/topo-physics';
    // networkPhysicsMenuItem.type.isResidentPage = true;
    networkPhysicsMenuItem.parentId = networkMenuItem.id;
    menuItems.push(networkPhysicsMenuItem);

    // 主导航-三级菜单：GIS拓扑
    let networkGisMenuItem = new TpiMenuItem();
    networkGisMenuItem.id = 2000001;
    networkGisMenuItem.name = 'unm.topo.network.gis';
    networkGisMenuItem.icon = '';
    networkGisMenuItem.path = '/unm-topo/topo-gis';
    networkGisMenuItem.parentId = networkMenuItem.id;
    menuItems.push(networkGisMenuItem);

    return menuItems;
  }
}
