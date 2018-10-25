import { Component } from '@angular/core';
import { constant } from '../../tutorial-templet.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * templet-thought
 * @export
 * @class TempletThoughtComponent
 */
@Component({
  templateUrl: './templet-thought.component.html',
  styleUrls: ['./templet-thought.component.scss']
})
export class TempletThoughtComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialTempletModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
