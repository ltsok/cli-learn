import { Component } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { constant } from '../../../tutorial-start.constant';

/**
 * ext-module
 * @export
 * @class ExtModuleComponent
 */
@Component({
  templateUrl: './ext-module.component.html',
  styleUrls: ['./ext-module.component.scss']
})
export class ExtModuleComponent {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialStartModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
