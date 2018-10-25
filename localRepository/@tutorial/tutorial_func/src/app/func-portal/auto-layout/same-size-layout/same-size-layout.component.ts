import { Component } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * same-size-layout
 * @export
 * @class SameSizeLayoutComponent
 */
@Component({
  templateUrl: './same-size-layout.component.html',
  styleUrls: ['./same-size-layout.component.scss']
})
export class SameSizeLayoutComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialFuncModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
