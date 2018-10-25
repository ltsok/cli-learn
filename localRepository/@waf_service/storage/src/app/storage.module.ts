import { NgModule } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { constant } from './storage.constant';
import { IndexDBService } from './service/indexdb.service';
import { LocalStorageService } from './service/localstorage.service';
export { IndexDBService } from './service/indexdb.service';
export { LocalStorageService } from './service/localstorage.service';

/**
 * 存储模块
 * @export
 * @class StorageModule
 */
@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
    { provide: IndexDBService, useClass: IndexDBService },
    { provide: LocalStorageService, useClass: LocalStorageService }
  ]
})
export class StorageModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof StorageModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize storage module.');
  }
}
