import { Component } from '@angular/core';
import { constant } from '../../../tutorial-service.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * cache
 * @export
 * @class CacheComponent
 */
@Component({
  templateUrl: './cache.component.html',
  styleUrls: ['./cache.component.scss']
})
export class CacheComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialServiceModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
