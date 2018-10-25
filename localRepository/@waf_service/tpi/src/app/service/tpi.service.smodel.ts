import { TpiMenuItem } from "../tpi-menu/tpi-menu.model";

/**
 * 菜单
 * @export
 * @class Menu
 */
export class Menu {

  /** 菜单项索引(菜单项Id:菜单项对象) */
  index: Map<number, TpiMenuItem> = new Map<number, TpiMenuItem>();

  /** 菜单项(父菜单项Id:子菜单项Id列表) */
  relation: Map<number, number[]> = new Map<number, number[]>();
}



