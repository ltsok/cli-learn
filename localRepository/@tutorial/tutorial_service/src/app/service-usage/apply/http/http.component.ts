import { Component } from '@angular/core';
import { constant } from '../../../tutorial-service.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * http
 * @export
 * @class HttpComponent
 */
@Component({
  templateUrl: './http.component.html',
  styleUrls: ['./http.component.scss']
})
export class HttpComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialServiceModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
