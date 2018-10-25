import { Component } from '@angular/core';
import { constant } from '../../../tutorial-component.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * ng-zorro
 * @export
 * @class NgZorroComponent
 */
@Component({
  templateUrl: './ng-zorro.component.html',
  styleUrls: ['./ng-zorro.component.scss']
})
export class NgZorroComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialComponentModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
