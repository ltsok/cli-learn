import { TpiMenuItem } from '@waf_service/tpi';

/**
 * 菜单项视图模型
 * @export
 * @class MenuVModelItem
 * @extends {TpiMenuItem}
 */
export class MenuVModelItem extends TpiMenuItem {

  children: MenuVModelItem[];

  constructor(tpiMenuItem: TpiMenuItem) {
    super();
    this.id = tpiMenuItem.id;
    this.type = tpiMenuItem.type;
    this.name = tpiMenuItem.name;
    this.path = tpiMenuItem.path;
    this.pathParam = tpiMenuItem.pathParam;
    this.linkId = tpiMenuItem.linkId;
    this.icon = tpiMenuItem.icon;
    this.isHide = tpiMenuItem.isHide;
    this.parentId = tpiMenuItem.parentId;
  }
}
