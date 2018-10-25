import { Component } from '@angular/core';
import { constant } from '../../../tutorial-component.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * KenDo
 * @export
 * @class KenDoComponent
 */
@Component({
  templateUrl: './KenDo.component.html',
  styleUrls: ['./KenDo.component.scss']
})
export class KenDoComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialComponentModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
