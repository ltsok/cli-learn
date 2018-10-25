import { Component } from '@angular/core';
import { constant } from '../../../tutorial-func.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * row-layout
 * @export
 * @class RowLayoutComponent
 */
@Component({
  templateUrl: './row-layout.component.html',
  styleUrls: ['./row-layout.component.scss']
})
export class RowLayoutComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialFuncModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
