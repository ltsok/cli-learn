import { Component } from '@angular/core';
import { constant } from '../../../tutorial-func.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * column-layout
 * @export
 * @class ColumnLayoutComponent
 */
@Component({
  templateUrl: './column-layout.component.html',
  styleUrls: ['./column-layout.component.scss']
})
export class ColumnLayoutComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialFuncModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
