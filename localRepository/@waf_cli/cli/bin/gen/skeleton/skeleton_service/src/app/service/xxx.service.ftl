import { Injectable } from "@angular/core";
import { LoggerService } from '@waf_service/logger';
import { constant } from '../{{module.prefix}}.constant';

/**
 * {{module.name}}服务
 * @export
 * @class {{module.camelName}}Service 
 */
@Injectable()
export class {{module.camelName}}Service {
  
  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof {{module.camelName}}Service
   */
  constructor(private logger: LoggerService) {
      this.logger.info(constant.identifier, 'Initialize {{module.name}} service.');
  }
}
