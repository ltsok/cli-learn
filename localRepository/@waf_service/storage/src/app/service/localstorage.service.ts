import { Injectable } from "@angular/core";
import { LoggerService } from '@waf_service/logger';
import { CacheService } from '@waf_service/cache';
import { constant } from '../storage.constant';

/**
 * localstorage服务
 * @export
 * @class LocalStorageService
 */
@Injectable()
export class LocalStorageService {

  /** localStorage实例 */
  localstorage = window.localStorage;

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {CacheService} cache
   * @memberof LocalStorageService
   */
  constructor(private logger: LoggerService, private cache: CacheService) {
    this.logger.info(constant.identifier, 'Initialize localstorage service.');
  }

  /**
   * 获取localStorage的值
   * @param {string} key
   * @param {boolean} [isSystem]
   * @returns {string}
   * @memberof LocalStorageService
   */
  getValue(key: string, isSystem?: boolean): string {

    let realKey = this.getRealKey(key, isSystem);
    let value = this.localstorage.getItem(realKey);
    this.logger.debug(constant.identifier, value, 'get-' + realKey);
    return value;
  }

  /**
   * 获取localStorage的Json对象
   * @param {string} key
   * @param {boolean} [isSystem]
   * @returns {*}
   * @memberof LocalStorageService
   */
  getJsonObj(key: string, isSystem?: boolean): any {
    return JSON.parse(this.getValue(key, isSystem));
  }

  /**
   * 设置localStorage的值
   * @param {string} key
   * @param {*} value
   * @param {boolean} [isSystem]
   * @memberof LocalStorageService
   */
  setValue(key: string, value: any, isSystem?: boolean): void {

    let realKey = this.getRealKey(key, isSystem);
    if (typeof value === 'string') {
      this.localstorage.setItem(realKey, value);
      this.logger.debug(constant.identifier, value, 'set-' + realKey);
    } else {
      let jsonValue = JSON.stringify(value);
      this.localstorage.setItem(realKey, jsonValue);
      this.logger.debug(constant.identifier, jsonValue, 'set-' + realKey);
    }
  }

  /**
   * 删除localStorage的值
   * @param {string} key
   * @param {boolean} [isSystem]
   * @memberof LocalStorageService
   */
  remove(key: string, isSystem?: boolean): void {
    let realKey = this.getRealKey(key, isSystem);
    this.localstorage.removeItem(realKey);
    this.logger.debug(constant.identifier, realKey, 'remove');
  }

  /**
   * 清空当前token的localStorage
   * @memberof LocalStorageService
   */
  clearCur(): void {

    let token = this.cache.getCache("token");
    let length = this.localstorage.length;
    for (let i = 0; i < length; i++) {
      let realKey = this.localstorage.key(i);
      if (realKey && realKey.indexOf(token) === 0) {
        this.localstorage.removeItem(realKey);
      }
    }
    this.logger.debug(constant.identifier, token, 'clear-current');
  }

  /**
   * 清空用户级的localStorage
   * @memberof LocalStorageService
   */
  clearUser(): void {

    let delKeys = [];
    let length = this.localstorage.length;
    for (let i = 0; i < length; i++) {
      let realKey = this.localstorage.key(i);
      if (realKey && realKey.indexOf(constant.userLocalstorageIdentifier) !== -1) {
        delKeys.push(realKey);
      }
    }
    delKeys.forEach(key => this.localstorage.removeItem(key));
    this.logger.debug(constant.identifier, constant.userLocalstorageIdentifier, 'clear-user');
  }

  /**
   * 获取真实的key值（如果是用户级的信息则要加上token）
   * @private
   * @param {string} key
   * @param {boolean} isSystem
   * @returns {string}
   * @memberof LocalStorageService
   */
  private getRealKey(key: string, isSystem: boolean): string {
    return isSystem ? key : this.cache.getCache("token") + constant.userLocalstorageIdentifier + key;
  }
}
