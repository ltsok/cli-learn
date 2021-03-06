import { Component } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { constant } from '../../tutorial-start.constant';

/**
 * environment
 * @export
 * @class EnvironmentComponent
 */
@Component({
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.scss']
})
export class EnvironmentComponent {

 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialStartModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
