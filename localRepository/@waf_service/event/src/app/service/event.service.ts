import { Injectable } from "@angular/core";
import { LoggerService } from '@waf_service/logger';
import { constant } from '../event.constant';

/**
 * event服务
 * @export
 * @class EventService
 */
@Injectable()
export class EventService {

  private channels: any = [];

  /**
  * 构造函数
  * @param {LoggerService} logger
  * @memberof EventService
  */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize event service.');
  }

  /**
   * 订购某事件主题
   * @param {string} topic
   * @param {(...args: any[]) => Promise<string>} handler
   * @memberof EventService
   */
  subscribe(topic: string, handler: (...args: any[]) => Promise<string>): void {

    // 给新的事件初始化
    if (!this.channels[topic]) {
      this.channels[topic] = [];
    }

    // 绑定事件对应的回调函数
    this.channels[topic].push(handler);

    this.logger.debug(constant.identifier, topic, 'subscribe-topic');
    this.logger.debug(constant.identifier, this.channels[topic], 'subscribe-handlers');
  }

  /**
   * 取消订购某事件主题
   * @param {string} topic
   * @memberof EventService
   */
  unsubscribe(topic: string): void {

    // 如果存在此事件主题则将绑定的回调函数解除
    let t = this.channels[topic];
    if (t) {
      delete this.channels[topic];
      this.logger.debug(constant.identifier, topic, 'unsubscribe-topic');
    }
  }

  /**
   * 发布事件
   * @param {string} topic
   * @param {...any[]} args
   * @returns {Promise<any>}
   * @memberof EventService
   */
  publish(topic: string, ...args: any[]): Promise<any> {

    this.logger.debug(constant.identifier, topic, 'publish-topic');
    let logger = this.logger;

    // 按照Promise链顺序执行事件回调函数
    let t = this.channels[topic];
    let run = [];
    if (t) {
      t.forEach((handler: (...args: any[]) => Promise<string>) => {

        run.push(new Promise(function (resolve, reject) {

          handler(...args).then(
            (info: string) => {
              logger.debug(constant.identifier, info, 'publish-success');
              resolve();
            },
            (error: string) => {
              logger.error(constant.identifier, error, 'publish-fail');
              reject();
            });
        }));
      });
    }

    return Promise.all(run);
  }
}
