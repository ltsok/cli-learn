import { Injectable } from "@angular/core";
import { LoggerService } from '@waf_service/logger';
import { constant } from '../cache.constant';

/**
 * cache服务
 * @export
 * @class CacheService
 */
@Injectable()
export class CacheService {

  /** 缓存 */
  private cache: Map<string, any> = new Map<string, any>();

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof CacheService
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize cache service.');
  }

  /**
   * 设置缓存值
   * @param key
   * @param value
   * @memberof CacheService
   */
  setCache(key: string, value: any): void {
    this.cache.set(key, value);
    this.logger.debug(constant.identifier, value, 'set-cache-' + key);
  }

  /**
   * 获取缓存值
   * @param {string} key
   * @returns {*}
   * @memberof CacheService
   */
  getCache(key: string): any {
    let value = this.cache.get(key);
    this.logger.debug(constant.identifier, value, 'get-cache-' + key);
    return value;
  }

  /**
   * 获取所有的缓存对象
   * @returns {Map<string, any>}
   * @memberof CacheService
   */
  getAllCache(): Map<string, any> {
    this.logger.debug(constant.identifier, this.cache, 'get-all-cache');
    return this.cache;
  }

  /**
   * 清空缓存
   * @memberof CacheService
   */
  clear(): void {
    this.cache.clear();
    this.logger.debug(constant.identifier, 'clear-cache', 'clear-cache');
  }
}
