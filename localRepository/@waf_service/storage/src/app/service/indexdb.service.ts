import { Injectable } from "@angular/core";
import { LoggerService } from '@waf_service/logger';
import { CacheService } from '@waf_service/cache';
import { constant } from '../storage.constant';
import * as localforage from "localforage";

/**
 * storage服务
 * @export
 * @class StorageService
 */
@Injectable()
export class IndexDBService {

  /** localforage实例MAP */
  forages: Map<string, LocalForage> = new Map<string, LocalForage>();

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {CacheService} cache
   * @memberof IndexDBService
   */
  constructor(private logger: LoggerService, private cache: CacheService) {

    // 打印日志
    this.logger.info(constant.identifier, 'Initialize indexdb service.');
  }

  /**
   * 创建实例
   * @param {string} name
   * @memberof IndexDBService
   */
  createInstance(name: string): void {

    // 创建实例
    let instance = localforage.createInstance({
      name: name
    });
    instance.setDriver(localforage.INDEXEDDB);

    // 添加实例
    this.forages.set(name, instance);
  }

  /**
   * 删除实例
   * @param {boolean} [isSystem]
   * @returns {Promise<void>}
   * @memberof IndexDBService
   */
  dropInstance(isSystem?: boolean): Promise<void> {
    return this.getInstance(isSystem).dropInstance();
  }

  /**
   * 获取值
   * @template T
   * @param {*} key
   * @param {boolean} [isSystem]
   * @returns {Promise<T>}
   * @memberof IndexDBService
   */
  getValue<T>(key, isSystem?: boolean): Promise<T> {
    return this.getInstance(isSystem).getItem(key);
  }

  /**
   * 设置值
   * @template T
   * @param {*} key
   * @param {*} value
   * @param {boolean} [isSystem]
   * @returns {Promise<T>}
   * @memberof IndexDBService
   */
  setValue<T>(key, value, isSystem?: boolean): Promise<T> {
    return this.getInstance(isSystem).setItem(key, value);
  }

  /**
   * 删除值
   * @param {string} key
   * @param {boolean} [isSystem]
   * @returns {Promise<void>}
   * @memberof IndexDBService
   */
  remove(key: string, isSystem?: boolean): Promise<void> {
    return this.getInstance(isSystem).removeItem(key);
  }

  /**
   * 清空所有实例
   * @memberof IndexDBService
   */
  clear(): void {
    this.forages.forEach((localForage: LocalForage) => {
      localForage.dropInstance();
    });
  }

  /**
   * 获取实例
   * @private
   * @param {boolean} isSystem
   * @returns {LocalForage}
   * @memberof IndexDBService
   */
  private getInstance(isSystem: boolean): LocalForage {

    // 确定是系统级还是用户级实例
    let instanceName = '';
    if (isSystem) {
      instanceName = 'sysdb';
    } else {
      instanceName = this.cache.getCache("token");
    }

    // 如果实例不存在则创建
    if (!this.forages.get(instanceName)) {
      this.createInstance(instanceName);
    };

    return this.forages.get(instanceName);
  }
}
