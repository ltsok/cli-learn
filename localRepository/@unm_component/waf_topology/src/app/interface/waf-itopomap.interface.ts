import {WafTNode} from '../model/waf-tnode.model';
import {WafTLink} from '../model/waf-tlink.model';
import {WafTRange} from '../model/waf-trange.model';
import {WafTLabel} from '../model/waf-tlabel.model';
import {WafITopoAction} from './waf-itopoAction.interface';
import { Injectable } from "@angular/core";
import {WafTopologyComponent} from './../waf-topology.component';
import {WafTopoStyle} from '../model/waf-style.model';

@Injectable()
export abstract class WafITopoMap {
  wafTopologyComponents:WafITopoAction[] = new Array();
  wafTopologyComponent:WafITopoAction;
  setJTopoAction(pItopoaction: WafITopoAction) {
    this.wafTopologyComponent = pItopoaction;
  }
  addWafTopologyComponent(c:WafITopoAction) {
    this.wafTopologyComponents.push(c);
  }
  getWafTopologyComponent() {
    return this.wafTopologyComponent;
  }
  searchComponent(c:WafITopoAction) {
    if (null != this.wafTopologyComponents) {
      for (var i = 0; i < this.wafTopologyComponents.length; i++) {
        if (this.wafTopologyComponents[i] == c) {
          this.wafTopologyComponent = this.wafTopologyComponents[i];
          break;
        }
      }
    }
  }
  abstract callLater(opType:number, params:any);
  abstract addChild(group:Object, node:Object);
  abstract moveElements(obj:Object, dx:number, dy:number);
  abstract getDistance(type:number, p1, p2);
  abstract hasInitialized():boolean;
  abstract getStaticStyle():WafTopoStyle;
  abstract createMap(config:WafTopoStyle):Object;
  abstract addMenus();
  abstract createNode(node:WafTNode, config:WafTopoStyle):Object;
  abstract createLink(node:WafTLink, config:WafTopoStyle):Object;
  abstract createRange(range:WafTRange, config:WafTopoStyle):Object;
  abstract createLabel(node:WafTLabel, config:WafTopoStyle):Object;
  abstract addOverLay(overlay:any):void;
  abstract panTo(type:number, config:any):void;
  abstract zoomIn():void;
  abstract zoomOut():void;
  abstract getDefaultZoom():number;
  abstract getMinZoom():number;
  abstract getMaxZoom():number;
  abstract setZoom(zoomlevel:number):void;
  abstract showOverLay(overlay:any):void;
  abstract hideOverLay(overlay:any):void;
  abstract removeOverLay(overlay:any):void;
  abstract updateNode(tnode: WafTNode, opType: number, params:any): any;
  abstract updateLink(tlink:WafTLink, opType:number):void;
  abstract updateRange(trange:WafTRange):void;
  abstract updateLabel(tlabel:WafTLabel):void;
  abstract centerAndZoom(node:WafTNode):void;
  abstract showShadow(node:WafTNode, flag:boolean):void;
  abstract release(node:WafTNode):void;
  abstract getNodeLocation(node:WafTNode):any;
  abstract setPosition(node:Object, x:number, y:number);
  abstract getUIBounds(obj:Object):Object;
  abstract getAddress(lng, lat, callback);
  abstract showOverview();
  abstract hideOverview();
  abstract getThirdParty();
  abstract setCurrentMode(mode:number);
  abstract setSection(selectedNodes:Array<WafTNode>);
  abstract destroy();
}
