import { Component } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { constant } from '../../../tutorial-start.constant';

/**
 * ext-iconfont
 * @export
 * @class ExtIconfontComponent
 */
@Component({
  templateUrl: './ext-iconfont.component.html',
  styleUrls: ['./ext-iconfont.component.scss']
})
export class ExtIconfontComponent {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialStartModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
