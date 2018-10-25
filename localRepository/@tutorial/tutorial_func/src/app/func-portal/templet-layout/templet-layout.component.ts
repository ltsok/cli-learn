import { Component } from '@angular/core';
import { constant } from '../../tutorial-func.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * templet-layout
 * @export
 * @class TempletLayoutComponent
 */
@Component({
  templateUrl: './templet-layout.component.html',
  styleUrls: ['./templet-layout.component.scss']
})
export class TempletLayoutComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialFuncModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
