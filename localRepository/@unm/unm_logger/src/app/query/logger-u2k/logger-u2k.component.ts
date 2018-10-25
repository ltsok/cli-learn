import { Component } from '@angular/core';
import { constant } from '../../unm-logger.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * logger-u2k
 * @export
 * @class LoggerU2kComponent
 */
@Component({
  templateUrl: './logger-u2k.component.html',
  styleUrls: ['./logger-u2k.component.scss']
})
export class LoggerU2kComponent {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof UnmLoggerModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
