import { NgModule } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { constant } from './cache.constant';
import { CacheService } from './service/cache.service';
export { CacheService } from './service/cache.service';

/**
 * 缓存模块
 * @export
 * @class CacheModule
 */
@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
    { provide: CacheService, useClass: CacheService }
  ]
})
export class CacheModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof CacheModule
   */
  constructor(private logger: LoggerService, private cache: CacheService) {
    this.logger.info(constant.identifier, 'Initialize cache module.');
  }
}
