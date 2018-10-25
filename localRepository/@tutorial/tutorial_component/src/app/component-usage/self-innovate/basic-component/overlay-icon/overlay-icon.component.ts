import { Component } from '@angular/core';
import { constant } from '../../../../tutorial-component.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * overlay-icon
 * @export
 * @class OverlayIconComponent
 */
@Component({
  templateUrl: './overlay-icon.component.html',
  styleUrls: ['./overlay-icon.component.scss']
})
export class OverlayIconComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialComponentModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
