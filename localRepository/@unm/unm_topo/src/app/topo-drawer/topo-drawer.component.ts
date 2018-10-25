import { Component, Input, ViewChild } from '@angular/core';
import { constant } from '../unm-topo.constant';
import { LoggerService } from '@waf_service/logger';
import { TpiService } from '@waf_service/tpi';
import { ContextService } from "@waf_service/context";
import { HttpService, RequestMsg } from "@waf_service/http";
import { Router } from "@angular/router";

/**
 * topo-drawer
 * @export
 * @class TopoDrawerComponent
 */
@Component({
  selector: 'topo-drawer',
  templateUrl: './topo-drawer.component.html',
  styleUrls: ['./topo-drawer.component.scss']
})

export class TopoDrawerComponent {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {ContextService} context
   * @memberof UnmTopoModule
   */
  constructor(private logger: LoggerService, private context: ContextService, private http: HttpService, private tpi: TpiService) {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
  radioValue: string = "info";
  isInfo: boolean = true;
  visiable: boolean = false;
  ne: NEModel = new NEModel();
  _neId;
  @Input() set neId(value: string) {
    if (value) {
      this.radioValue = 'info';
      this._neId = value;
      this.getNeInfo(value);
    }
  }
  @ViewChild('nzDrawer') nzDrawer: any
  close() {
    this.visiable = false;
  }

  getNeInfo(id: string) {
    let req: RequestMsg = new RequestMsg();
    let args = new Map<string, string>();
    args.set('neId', id);
    req.filter = args;
    req.res = '/cm/ne';
    this.http.get(req).then((result) => {
      this.isInfo = true;
      this.visiable = true;
      this.ne = result.content as NEModel;
    })
  }

  boxRouterClick() {
    let item = this.tpi.getMenuItem(200010000);//定位到设备框视图界面
    item.pathParam = { neId: this._neId, name: this.ne.name, ip: this.ne.ip, type: this.ne.neTypeName };
    this.context.navigate(item);
  }
}

export class NEModel {
  operType: null;
  oid: null;
  operationId: null;
  parentId: null;
  objId: null;
  neType: null;
  neTypeName: null;
  neRealType: null;
  haveAuthority: null;
  serial: null;
  name: null;
  friendName: null;
  factoryName: null;
  bureauName: null;
  objNo: null;
  switch1: null;
  switch2: null;
  deivceState: null;
  communicateType: null;
  communicateNE: null;
  managerNo: null;
  managerProtocolType: null;
  netBlockId: null;
  ip: null;
  mask: null;
  gateway: null;
  userName: null;
  password: null;
  remark: null;
  version: null;
  reserve1: null;
  reserve2: null;
  defaultShelfTypes: null;
  emuType: null;
  shelfType: null;
  gne: null;
  snmpTemplateId: null;
  gneGroupId: null;
  doubleNodeProtect: null;
  detectProtocolEnable: null;
  detectProtocolInterval: null;
  backIp: null;
  mainDomainIp: null;
  backDomainIp: null;
  ipKeepingTime: null;
  agingParameter: null;
  strNESerial: null;
  topoKeyToValueMap: null;
  pppAddr: null;
  pppMark: null;
  netFilter: false;
  asonEnable: false;
  enableBreakInteval: true;
  breakInteval: null;
  asonAddr: null;
  userLabel: null;
  domainMark: null;
  domainId: null;
  domainType: null;
  priority: false;
  createTime: null;
  neBackIp: null;
  neBackMask: null;
  neBackGateWay: null;
  location: null;
  netinTime: null
}
