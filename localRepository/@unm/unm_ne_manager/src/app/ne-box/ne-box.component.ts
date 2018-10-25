import { Component } from '@angular/core';
import { constant } from '../unm-ne-manager.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
/**
 * ne-box
 * @export
 * @class NeBoxComponent
 */
@Component({
  templateUrl: './ne-box.component.html',
  styleUrls: ['./ne-box.component.scss']
})
export class NeBoxComponent {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {ContextService} context
   * @memberof UnmNeManagerModule
   */
  constructor(private logger: LoggerService, private context: ContextService) {
    this.neInfo = this.context.getRouterParam();
  }

  neInfo: any;
}
