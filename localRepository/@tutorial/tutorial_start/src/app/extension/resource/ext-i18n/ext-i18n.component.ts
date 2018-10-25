import { Component } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { constant } from '../../../tutorial-start.constant';

/**
 * ext-i18n
 * @export
 * @class ExtI18nComponent
 */
@Component({
  templateUrl: './ext-i18n.component.html',
  styleUrls: ['./ext-i18n.component.scss']
})
export class ExtI18nComponent {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialStartModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
