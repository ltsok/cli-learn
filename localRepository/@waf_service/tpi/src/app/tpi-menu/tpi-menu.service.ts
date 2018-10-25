import { Injectable } from "@angular/core";
import { ITpiMenu } from './tpi-menu.interface';
import { TpiMenuItem } from './tpi-menu.model';

/**
 * 菜单哑服务
 * @export
 * @class DummyMenuService
 * @implements {ITpiMenu}
 */
@Injectable()
export class DummyMenuService implements ITpiMenu {

  getMenuItems(): TpiMenuItem[] {
    return [];
  }
}
