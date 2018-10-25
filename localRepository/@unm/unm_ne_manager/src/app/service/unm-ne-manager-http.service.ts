import { Injectable } from "@angular/core";
import { HttpService, RequestMsg } from "@waf_service/http";
import { ContextService } from "@waf_service/context";
import { PushService } from "@waf_service/push";
/**
 * unm_ne_manager http服务
 * @export
 * @class UnmNeManagerHttpService
 * @implements {}
 */
@Injectable()
export class UnmNeManagerHttpService {
  constructor(private http: HttpService, private context: ContextService, private push: PushService) {

  }
  alarmStatus;
  /**
   * 根据网元Id获取设备框视图基本信息
   * @param neId 
   * @param callback 
   */
  getBoxInfoByNeId(neId: number, callback) {
    let req: RequestMsg = new RequestMsg();
    req.res = '/nm/neShelfView?neId=' + neId;
    this.context.showLoading();
    this.http.get(req).then(callback);
  }

  /**
   * 根据网元Id获取单盘端口列表数据
   * @param neId 
   * @param callback 
   */
  getSingleDeckByDishId(dishId: number, callback) {
    let req: RequestMsg = new RequestMsg();
    req.res = `/nm/board/${dishId}/unmPorts`;
    this.context.showLoading();
    this.http.get(req).then(callback);
  }

  /**
   * 订阅告警灯推送
   * @param callback 
   */
  subscribeAlarmStatus(callback) {
    let userId = this.context.getLoginInfo().user.id;
    this.alarmStatus = this.push.subscribe('/alm/neLamp/' + userId, callback);
  }

  /**
   * 取消告警灯推送订阅
   */
  unSubscribeAlarmStatus() {
    this.push.unsubscribe(this.alarmStatus);
  }
}
