import { Component } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

/**
 * portal-introduce
 * @export
 * @class PortalIntroduceComponent
 */
@Component({
  templateUrl: './portal-introduce.component.html',
  styleUrls: ['./portal-introduce.component.scss']
})
export class PortalIntroduceComponent {
  
 /**
  * 构造函数
  * @param {LoggerService} logger
  * @param {ContextService} context
  * @memberof TutorialFuncModule
  */
  constructor(private logger: LoggerService, private context: ContextService) {
  }
}
