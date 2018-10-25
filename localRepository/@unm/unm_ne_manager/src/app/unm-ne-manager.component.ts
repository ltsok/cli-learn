import { Component } from '@angular/core';
import { UnmNeManagerModel } from './model/unm-ne-manager.model';
import { ContextService } from "@waf_service/context";
import { TpiService } from "@waf_service/tpi";
/**
 * 模块壳组件
 * @export
 * @class DefaultComponent
 */
@Component({
  templateUrl: './unm-ne-manager.component.html',
  styleUrls: ['./unm-ne-manager.component.scss']
})
export class UnmNeManagerComponent {
  neInfo: any;
  constructor(private con: ContextService, private tpi: TpiService) {
    this.neInfo = this.con.getRouterParam();
    this.con.subscribe('event.templet.submenu.navigate.start', (param: any) => {
      return new Promise((resolve, reject) => {
        // param.pathParam = neId;
        // console.log('11111');
        // console.log(param.id);
        if (param.id === 200010000) {//框图
          this.tpi.updatePathParam(param.id, this.neInfo);
        } else {
          this.tpi.updatePathParam(param.id, this.neInfo.neId);
        }
        console.log(this.tpi.getMenuItem(param.id));
        resolve();
      });
    });
  }
}
