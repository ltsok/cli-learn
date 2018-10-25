import { Injectable } from "@angular/core";
import { LoggerService } from '@waf_service/logger';
import { EventService } from "@waf_service/event";
import { constant } from '../push.constant';
import * as Stomp from "stompjs";
import { CacheService } from '@waf_service/cache';
import * as SockJS from "sockjs-client";
import { HttpService } from '@waf_service/http';


/**
 * push服务
 * @export
 * @class PushService
 */
@Injectable()
export class PushService {
  client;

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {EventService} evnet
   * @memberof PushService
   */
  constructor(private logger: LoggerService, private http: HttpService, private event: EventService, private cache: CacheService) {
    this.logger.info(constant.identifier, 'Initialize push service.');
    this.initListener();

  }


  initListener() {
    let me = this;
    this.event.subscribe("event.service.tpi.login.success.start", () => {
      return new Promise((resolve, reject) => {
        this.logger.info(constant.identifier, "user login event subscribe success");
        me.connectServer(this.http.getServerUrl() + "/" + this.http.getServerVersion() + "/push");
        resolve();
      });
    });
    this.event.subscribe("event.service.router.new.tab", () => {
      return new Promise((resolve, reject) => {
        this.logger.info(constant.identifier, "new tab event subscribe success");
        me.connectServer(this.http.getServerUrl() + "/" + this.http.getServerVersion() + "/push");
        resolve();
      });
    })


  }

  connectServer(server) {
    let sock = new SockJS(server);
    this.client = Stomp.over(sock);
    let me = this;
    this.setHeartBeat(15000, 16000);//心跳设置需在connect前设置，不能动态修改
    this.client.connect({}, function (frame) {
      console.log('Connected: ' + frame);
      me.event.publish("event.websocket.connected", true);
    });
  }

  private setHeartBeat(outgoing: number, incoming: number) {
    //默认心跳均为10000ms
    this.client.heartbeat.outgoing = outgoing;
    this.client.heartbeat.incoming = incoming;

  }

  disconnect() {
    console.log("disconnect websocket" + this.client);
    this.client.disconnect();
  }


  private publish(destination: string, body: string, header?: object) {
    if (header == null) {
      header = {};
    }
    this.client.send(destination, header, body);
  }

  subscribe(destination: string, callback) {
    let header = { "token": this.cache.getCache("token") };
    let subscribeInfo = this.client.subscribe(destination, callback, header);
    return subscribeInfo;

  }

  subscribeByQueryId(destination: string, queryId: string, callback) {
    let des = destination + "/" + queryId;
    let subscribeInfo = this.subscribe(des, callback);
    return subscribeInfo;
  }

  unsubscribe(subscribeInfo) {
    subscribeInfo.unsubscribe();
  }
}
