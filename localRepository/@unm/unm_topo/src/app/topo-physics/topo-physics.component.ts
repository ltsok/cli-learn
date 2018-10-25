import { Component, ViewChild, ViewChildren, QueryList, ElementRef, OnInit, Injector } from '@angular/core';
import { constant } from '../unm-topo.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { PushService } from "@waf_service/push";
import { NzModalService, NzMessageService } from 'ng-zorro-antd';

import {
  WafTopologyComponent,
  WafTNode,
  WafTLink,
  WafTNodeIcon,
  WafTopoStyle,
  WafMapStyle,
  WafNodeStyle,
  WafLinkStyle,
  WafRangeStyle,
  WafLabelStyle
} from '@unm_component/waf_topology';

import { TpiGlobalService } from "@waf_service/tpi";
import { HttpService, RequestMsg } from "@waf_service/http";

import { TopoObjTreeComponent } from '../topo-objtree/topo-objtree.component';

/**
 * topo-physics
 * @export
 * @class TopoPhysicsComponent
 */
@Component({
  templateUrl: './topo-physics.component.html',
  styleUrls: ['./topo-physics.component.scss']
})
export class TopoPhysicsComponent implements OnInit {
  topoSelectId: string;
  treeData: any;
  pushData: Array<any>;
  almPushData: Array<any>;
  treeDataCache: any = [];
  treeAlmDataCache: any = [];
  topoCache: any = [];
  topoLoaded: boolean;
  topoRefreshed: boolean;
  objectTreeContent: any;
  neId: string;
  userId: string;
  height: number = 0;
  nmLamp;
  mainTopo;
  nmObject;

  /**
   * 监听对象树上每次的选中节点的事件
   * @param value 对象树上选中节点的id
   */
  treeSelect(obj: any) {
    console.log("选中节点的id：" + obj.nodeId);
    this.topologys.toArray()[0].doUpdate(1, null, { id: obj.nodeId }, null, null);
    // if (obj.type === 'NE') {
    //   this.neId = obj.nodeId;
    // }
    return obj.nodeId;
  }

  @ViewChildren(TopoObjTreeComponent)
  objecttrees: QueryList<TopoObjTreeComponent>;

  @ViewChildren(WafTopologyComponent)
  topologys: QueryList<WafTopologyComponent>;

  topoNode: WafTNode;
  oldOnResize:any;

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {ContextService} context
   * @memberof UnmTopoModule
   */
  constructor(private logger: LoggerService, private pushService: PushService, private context: ContextService, private http: HttpService, private tpi: TpiGlobalService, private modalService: NzModalService, private message: NzMessageService) {
    var loginInfo = context.getLoginInfo();
    if (null != loginInfo) {
      this.userId = loginInfo.user.id;
    }
  }

  queryForObjectTree() {
    var me = this;
    // query objecttree
    let req: RequestMsg = new RequestMsg();
    req.res = "/cm/queryUserMgrObjectTree";
    this.tpi.getGlobalService().showLoading();
    this.http.post(req).then((res) => {
      this.tpi.getGlobalService().hideLoading();
      if (res.result.code === '10000') {
        console.log('queryForObjectTree =>', res.content);
        // me.objecttrees.toArray()[0].packNodes(res.content);
        me.treeData = res.content;
        // 告警上报通道
        this.subscribeTopoAlmPass();
        this.objectTreeContent = res.content;
        // 查询拓扑数据
        this.queryForTopoDatas(this.objectTreeContent, 0);
      } else {
        this.tpi.getGlobalService().errorDialog(me.getI18n("unm.topo.tree.get.fail"));
      }
    });
  }

  constructTopoNode(dataSource: any, map: any) {
    if (null != dataSource) {
      this.topoNode = new WafTNode;
      this.topoNode.id = dataSource.id;
      this.topoNode.name = dataSource.name;
      this.topoNode.showname = dataSource.name;
      this.topoNode.type = 0;
      this.topoNode.childList = [];
      // this.topoNode.oldCoordinate = {x: 100, y : 100};
      this.topoNode.oldCoordinate = this.getCoordinateById(this.topoNode.id, map);
      this.topoNode.coordinate = this.topoNode.oldCoordinate;
      this.topoNode.params = map[this.topoNode.id]['otherParams'];
      this.packTopoNodes(this.topoNode, dataSource, map);
      // 设置顶层域坐标（当消息上报节点增加时，节点坐标即为顶层域坐标）
      var childNodes = this.topoNode.childList
      var minX = null;
      var minY = null;
      if (childNodes) {
        for (var i = 0; i < childNodes.length; i++) {
          if (null == minX) {
            minX = childNodes[i].coordinate.x;
          } else {
            if (childNodes[i].coordinate.x < minX) {
              minX = childNodes[i].coordinate.x;
            }
          }
          if (null == minY) {
            minY = childNodes[i].coordinate.y;
          } else {
            if (childNodes[i].coordinate.y < minY) {
              minY = childNodes[i].coordinate.y;
            }
          }
        }
        // 域永远位于左上角
        this.topoNode.oldCoordinate = { x: minX, y: minY };
        this.topoNode.coordinate = { x: minX, y: minY };
      }
    }
    return this.topoNode;
  }

  getOtherParams(topoNode: WafTNode, id: string, map: any) {
    if (null != map) {
      if (null != map[id]) {
        return map[id]['point'] == null ? { x: 0, y: 0 } : map[id]['point'];
      }
    }
    return { x: 0, y: 0 };
  }

  getCoordinateById(id: string, map: any) {
    if (null != map) {
      if (null != map[id]) {
        return map[id]['point'] == null ? { x: 0, y: 0 } : map[id]['point'];
      }
    }
    return { x: 0, y: 0 };
  }

  packTopoNodes(wafNode: WafTNode, dataSource: any, map: any) {
    if (null != dataSource) {
      var childNodes = dataSource.children;
      if (null != childNodes) {
        for (var i = 0; i < childNodes.length; i++) {
          if (childNodes[i].type == 'NE') {
            var neNode = new WafTNode;
            neNode.id = childNodes[i].id;
            neNode.type = 1;
            neNode.name = childNodes[i].name;
            neNode.showname = childNodes[i].name;
            /*neNode.imgsrc = './assets/common/unm_topo/defaultnelogo.svg';
            neNode.showimgsrc = './assets/common/unm_topo/defaultnelogo.svg';*/
            /*            neNode.oldCoordinate = {x: 100, y : 100};
                        neNode.coordinate = {x: 10* (i + 1) *  Math.floor(Math.random()*10+1), y : 5 * (i + 1) *  Math.floor(Math.random()*10+1)};*/
            neNode.oldCoordinate = this.getCoordinateById(neNode.id, map);
            neNode.coordinate = neNode.oldCoordinate;
            neNode.imgstyle = { w: 38, h: 46 };
            neNode.style = {};
            neNode.params = map[childNodes[i].id]['otherParams'];
            neNode.parent = wafNode;
            wafNode.childList.push(neNode);
            // 设置边框和小图标
            if (null != childNodes[i].iconRule) {
              var borderColor = childNodes[i].iconRule.borderColor;
              var maIcon = childNodes[i].iconRule.maIcon;
              var specialIcon = childNodes[i].iconRule.specialIcon;
              var primaryIcon = childNodes[i].iconRule.primaryIcon;
              var primaryIconColor = childNodes[i].iconRule.primaryIconColor;
              neNode.imgsrc = './assets/common/unm_topo/topo/' + this.getSvgIcon(0, primaryIcon.iconName, { index: primaryIconColor });
              neNode.showimgsrc = './assets/common/unm_topo/topo/' + this.getSvgIcon(0, primaryIcon.iconName, { index: primaryIconColor });
              if (null != borderColor) {
                if (null == neNode.style) {
                  neNode.style = {};
                }
                neNode.style.borderColor = borderColor;
              }
              if (null != maIcon) {
                if (null == neNode.iconChildList) {
                  neNode.iconChildList = new Array<WafTNodeIcon>();
                }
                var wafTNodeIcon = new WafTNodeIcon();
                var iconName = this.getSvgIcon(1, maIcon.iconName, null);
                wafTNodeIcon.imgsrc = './assets/common/unm_topo/' + maIcon.path + '/' + iconName;
                wafTNodeIcon.showimgsrc = './assets/common/unm_topo/' + maIcon.path + '/' + iconName;
                wafTNodeIcon.params = { 'position': 0.5 };
                wafTNodeIcon.parent = neNode;
                neNode.iconChildList.push(wafTNodeIcon);
              }
              if (null != specialIcon) {
                if (null == neNode.iconChildList) {
                  neNode.iconChildList = new Array<WafTNodeIcon>();
                }
                var wafTNodeIcon = new WafTNodeIcon();
                var iconName = this.getSvgIcon(1, specialIcon.iconName, null);
                wafTNodeIcon.imgsrc = './assets/common/unm_topo/' + specialIcon.path + '/' + iconName;
                wafTNodeIcon.showimgsrc = './assets/common/unm_topo/' + specialIcon.path + '/' + iconName;
                wafTNodeIcon.params = { 'position': 0 };
                wafTNodeIcon.parent = neNode;
                neNode.iconChildList.push(wafTNodeIcon);
              }
            }
          } else if (childNodes[i].type == 'DOMAIN') {
            var logicNode = new WafTNode;
            if (null != childNodes[i].iconRule) {
              var primaryIcon = childNodes[i].iconRule.primaryIcon;
              var primaryIconColor = childNodes[i].iconRule.primaryIconColor;
              logicNode.imgsrc = './assets/common/unm_topo/topo/' + this.getSvgIcon(0, primaryIcon.iconName, { index: primaryIconColor });
              logicNode.showimgsrc = './assets/common/unm_topo/topo/' + this.getSvgIcon(0, primaryIcon.iconName, { index: primaryIconColor });
            }
            logicNode.id = childNodes[i].id;
            logicNode.type = 0;
            logicNode.name = childNodes[i].name;
            logicNode.showname = childNodes[i].name;
            /*            logicNode.oldCoordinate = {x: 100, y : 100};
                        logicNode.coordinate = {x: 15 * (i + 1) *  Math.floor(Math.random()*10+1), y : 2 * (i + 1) *  Math.floor(Math.random()*10+1)};*/
            logicNode.oldCoordinate = this.getCoordinateById(logicNode.id, map);
            logicNode.coordinate = logicNode.oldCoordinate;
            logicNode.imgstyle = { w: 50, h: 50 };
            logicNode.style = {};
            logicNode.params = map[childNodes[i].id]['otherParams'];
            logicNode.childList = [];
            logicNode.parent = wafNode;
            wafNode.childList.push(logicNode);
            // 设置边框和小图标
            if (null != childNodes[i].iconRule) {
              var borderColor = childNodes[i].iconRule.borderColor;
              var maIcon = childNodes[i].iconRule.maIcon;
              var specialIcon = childNodes[i].iconRule.specialIcon;
              var primaryIcon = childNodes[i].iconRule.primaryIcon;
              var primaryIconColor = childNodes[i].iconRule.primaryIconColor;
              if (null != borderColor) {
                if (null == logicNode.style) {
                  logicNode.style = {};
                }
                logicNode.style.borderColor = borderColor;
              }
              if (null != maIcon) {
                if (null == logicNode.iconChildList) {
                  logicNode.iconChildList = new Array<WafTNodeIcon>();
                }
                var wafTNodeIcon = new WafTNodeIcon();
                var iconName = this.getSvgIcon(1, maIcon.iconName, null);
                wafTNodeIcon.imgsrc = './assets/common/unm_topo/' + maIcon.path + '/' + iconName;
                wafTNodeIcon.showimgsrc = './assets/common/unm_topo/' + maIcon.path + '/' + iconName;
                wafTNodeIcon.params = { 'position': 0.5 };
                wafTNodeIcon.parent = logicNode;
                logicNode.iconChildList.push(wafTNodeIcon);
              }
              if (null != specialIcon) {
                if (null == logicNode.iconChildList) {
                  logicNode.iconChildList = new Array<WafTNodeIcon>();
                }
                var wafTNodeIcon = new WafTNodeIcon();
                var iconName = this.getSvgIcon(1, specialIcon.iconName, null);
                wafTNodeIcon.imgsrc = './assets/common/unm_topo/' + specialIcon.path + '/' + iconName;
                wafTNodeIcon.showimgsrc = './assets/common/unm_topo/' + specialIcon.path + '/' + iconName;
                wafTNodeIcon.params = { 'position': 0 };
                wafTNodeIcon.parent = logicNode;
                logicNode.iconChildList.push(wafTNodeIcon);
              }
            }
            // 深度优先遍历
            this.packTopoNodes(logicNode, childNodes[i], map);
          }
        }
      }
    }
  }

  getSvgIcon(type: number, iconName: string, params: any) {
    if (0 == type) {
      // 主图标
      if (null != iconName) {
        if (iconName.endsWith('.png')) {
          var newIconName = iconName.substring(0, iconName.indexOf('.png'));
          return newIconName + '-0' + (Number(params['index']) + 1) + '.svg';
        }
      }
    } else if (1 == type) {
      // 小图标
      if (null != iconName) {
        if (iconName.endsWith('.png')) {
          var newIconName = iconName.replace('.png', '.svg');
          return newIconName;
        }
      }
      return null;
    }
    return null;
  }

  getWafTNodeById(wafTNode: WafTNode, id: string) {
    if (null != wafTNode) {
      if (wafTNode.id == id) {
        return wafTNode;
      }
      var childNodes = wafTNode.childList;
      if (null != childNodes) {
        for (var i = 0; i < childNodes.length; i++) {
          var node = this.getWafTNodeById(childNodes[i], id);
          if (node != null) {
            return node;
          }
        }
      }
    }
    return null;
  }

  reBuildTopoContent(dataSource: any) {
    var map = {};
    var allNodes = dataSource['topoTreeNodeMap'];
    if (null != allNodes) {
      for (var key in allNodes) {
        var nodeBean = allNodes[key].nodeBean;
        map[nodeBean.id] = { 'point': { 'x': nodeBean['point']['x'], 'y': nodeBean['point']['y'] }, 'otherParams': { key: nodeBean['key'] } };
        var children = allNodes[key].children;
        if (null != children) {
          for (var j = 0; j < children.length; j++) {
            map[children[j].id] = { 'point': { 'x': children[j]['point']['x'], 'y': children[j]['point']['y'] }, 'otherParams': { key: children[j]['key'] } };
          }
        }
      }
    }
    return map;
  }

  reConstructTopoNode(objTreeContent: any, dataSource: any) {
    // 获取所有节点坐标
    var map = this.reBuildTopoContent(dataSource);
    this.topoNode = this.constructTopoNode(objTreeContent, map);
    // 建立连线
    var topoLinks = dataSource['topoLinkMap'];
    if (null != topoLinks) {
      for (var key in topoLinks) {
        var value = topoLinks[key];
        var startNodeId = value.startNodeId;
        var endNodeId = value.endNodeId;
        var linkId = value.key.id;
        var leftWafNode = this.getWafTNodeById(this.topoNode, startNodeId);
        var rightWafNode = this.getWafTNodeById(this.topoNode, endNodeId);
        console.log('leftWafNode->', leftWafNode);
        console.log('rightWafNode->', rightWafNode);
        if (null != leftWafNode && null != rightWafNode) {
          var leftWafNodeParents = this.getParents(leftWafNode);
          var rightWafNodeParents = this.getParents(rightWafNode);
          var lastLeftWafNode = null;
          var lastRightWafNode = null;
          if (null != leftWafNodeParents && null != rightWafNodeParents) {
            for (var i = 0; i < leftWafNodeParents.length; i++) {
              for (var j = 0; j < rightWafNodeParents.length; j++) {
                if (leftWafNodeParents[i] != rightWafNodeParents[j] && leftWafNodeParents[i].parent == rightWafNodeParents[j].parent) {
                  var link = new WafTLink();
                  link.id = linkId;
                  link.leftnode = leftWafNodeParents[i];
                  link.rightnode = rightWafNodeParents[j];
                  link.leftNeNode = leftWafNode;
                  link.rightNeNode = rightWafNode;
                  link.name = value.name;
                  link.strokecolor = '0, 0, 255';
                  link.showname = value.name;
                  if (null == leftWafNodeParents[i].links) {
                    leftWafNodeParents[i].links = new Array<WafTLink>();
                  }
                  if (null == rightWafNodeParents[j].links) {
                    rightWafNodeParents[j].links = new Array<WafTLink>();
                  }
                  leftWafNodeParents[i].links.push(link);
                  rightWafNodeParents[j].links.push(link);
                  lastLeftWafNode = leftWafNodeParents[i];
                  lastRightWafNode = rightWafNodeParents[j];
                }
              }
            }
          }
          // 对于非网元的下层直至网元节点的中间节点全部需要添加向上连纤
          if (null != lastLeftWafNode) {
            // 非连纤网元
            var curNode = leftWafNode;
            while (null != curNode && curNode != lastLeftWafNode) {
              if (curNode.iconChildList == null) {
                curNode.iconChildList = new Array<WafTNodeIcon>();
              }
              if (!curNode.constainsIcon(1)) {
                var wafTNodeIcon = new WafTNodeIcon();
                wafTNodeIcon.imgsrc = './assets/common/unm_topo/up.svg';
                wafTNodeIcon.showimgsrc = './assets/common/unm_topo/up.svg';
                wafTNodeIcon.params = { 'position': 1 };
                wafTNodeIcon.parent = curNode;
                curNode.iconChildList.push(wafTNodeIcon);
              }
              curNode = curNode.parent;
            }
          }
          if (null != lastRightWafNode) {
            var curNode = rightWafNode;
            while (null != curNode && curNode != lastRightWafNode) {
              if (curNode.iconChildList == null) {
                curNode.iconChildList = new Array<WafTNodeIcon>();
              }
              if (!curNode.constainsIcon(1)) {
                var wafTNodeIcon = new WafTNodeIcon();
                wafTNodeIcon.imgsrc = './assets/common/unm_topo/up.svg';
                wafTNodeIcon.showimgsrc = './assets/common/unm_topo/up.svg';
                wafTNodeIcon.params = { 'position': 1 };
                wafTNodeIcon.parent = curNode;
                curNode.iconChildList.push(wafTNodeIcon);
              }
              curNode = curNode.parent;
            }
          }
        }
      }
    }
  }

  getParents(wafTNode: WafTNode) {
    var array = [];
    var pointer = wafTNode;
    while (null != pointer) {
      array.push(pointer);
      pointer = pointer.parent;
    }
    return array;
  }

  subscribeAlmNmLamp() {
    var me = this;
    this.nmLamp = this.pushService.subscribe('/alm/nmLamp/' + this.userId, (res) => {
      console.log('subscribeAlmNmLamp res = ', res);
      if (res.body != null) {
        var body = JSON.parse(res.body);
        if (null != body) {
          // 对象树接口调用
          me.almPushData = body;
          if (me.topoLoaded == true || me.topoRefreshed == true) {
            me.treeAlmDataCache.push(body);
          } else {
            me.handleAlmNmLamp(body);
          }
        }
      }
    });
  }

  handleAlmNmLamp(body: any) {
    var me = this;
    var addModels = [];
    if (null != body) {
      for (var i = 0; i < body.length; i++) {
        var id = body[i].id;
        var nodeType = body[i].nodeType;
        var icon = body[i].icon;
        if (null != icon) {
          var primaryIcon = icon.primaryIcon;
          var primaryIconColor = icon.primaryIconColor;
          var specialIcon = icon.specialIcon;
          var maIcon = icon.maIcon;
          var borderColor = icon.borderColor;
          var imgSrc = './assets/common/unm_topo/topo/' + this.getSvgIcon(0, primaryIcon.iconName, { index: primaryIconColor });
          var specialImgSrc = null;
          if (null != specialIcon) {
            specialImgSrc = './assets/common/unm_topo/' + specialIcon.path + '/' + this.getSvgIcon(1, specialIcon.iconName, null);
          }
          var maImgSrc = null;
          if (null != maIcon) {
            maImgSrc = './assets/common/unm_topo/' + maIcon.path + '/' + this.getSvgIcon(1, maIcon.iconName, null);
          }
        }
        addModels.push({ id: id, params: { imgSrc: imgSrc, specialImgSrc: specialImgSrc, maImgSrc: maImgSrc, borderColor: borderColor } });
      }
      this.topologys.toArray()[0].doUpdate(6, null, { 'model': addModels }, null, null);
    }
  }

  subscribeTopoAlmPass() {
    var me = this;
    this.mainTopo = this.pushService.subscribe('/topo/mainTopo/' + this.userId, (res) => {
      // res ws推送数据
      console.log('subscribeTopoAlmPass res = ', res);
      if (res.body != null) {
        var body = JSON.parse(res.body);
        if (null != body) {
          if (me.topoLoaded == true || me.topoRefreshed == true) {
            me.topoCache.push(body);
          } else {
            me.handleTopoAlmPass(body);
          }
        }
      }
    });
  }

  handleTopoAlmPass(body: any) {
    var me = this;
    if (null != body) {
      var type = body.type;
      var objs = body.obj;
      if (14 == type) {
        // 主动刷新
        me.modalService.confirm({
          nzTitle: me.getI18n("unm.topo.graph.confirm"),
          nzContent: me.getI18n("unm.topo.graph.reload"),
          nzOkText: me.getI18n("unm.topo.graph.confirm"),
          nzCancelText: me.getI18n("unm.topo.graph.cancel"),
          nzOnOk: function () {
            me.queryForTopoDatas(me.objectTreeContent, 1);
          }
        });
      } else if (2 == type || 'TOPO_LINE_DELETE' == type) {
        // 光纤删除
        var deleteModels = [];
        if (null != objs) {
          for (var i = 0; i < objs.length; i++) {
            if ('DELETE' == objs[i].operType) {
              deleteModels.push({ id: objs[i].key.id });
            }
          }
        }
        this.topologys.toArray()[0].doUpdate(5, null, { 'delete': deleteModels }, null, null);
      } else if (1 == type) {
        var addModels = [];
        // 光纤添加
        if (null != objs) {
          for (var i = 0; i < objs.length; i++) {
            if ('CREATE' == objs[i].operType) {
              addModels.push({ id: objs[i].key.id, name: objs[i].name, startNodeId: objs[i].startNodeId, endNodeId: objs[i].endNodeId });
            }
          }
        }
        this.topologys.toArray()[0].doUpdate(5, null, { 'create': addModels }, null, null);
      }
    }
  }

  subscribeNodeVerifyPass() {
    var me = this;
    this.nmObject = this.pushService.subscribe('/cm/nmObject/' + this.userId, (res) => {
      console.log('subscribeTreeNodeVerifyPass res = ', res);
      if (res.body != null) {
        var body = JSON.parse(res.body);
        // 对象树接口调用
        me.pushData = body;
        if (null != body) {
          if (me.topoLoaded == true || me.topoRefreshed == true) {
            me.treeDataCache.push(body);
          } else {
            me.handleNodeVerifyPass(body);
          }
        }
      }
    });
  }

  handleNodeVerifyPass(body: any) {
    var me = this;
    if (null != body) {
      var addModels = [];
      var deleteModels = [];
      var updateModels = [];
      for (var i = 0; i < body.length; i++) {
        var type = body[i].type;
        var object = body[i].object;
        // 逻辑域的消息
        if ('LOGIC_DOMAIN' == type) {
          var parentId = object['parentId'];
          var domainId = object['domainId'];
          var domainName = object['domainName'];
          var friendName = object['friendName'];
          var operType = object['operType'];
          var name = '' == friendName ? domainName : friendName;
          if ('CREATE' == operType) {
            var newWafTNode = new WafTNode();
            newWafTNode.id = domainId;
            newWafTNode.name = name;
            newWafTNode.showname = name;
            newWafTNode.imgstyle = { w: 50, h: 50 };
            newWafTNode.type = 0;
            addModels.push({ model: newWafTNode, parentId: parentId });
          } else if ('DELETE' == operType) {
            deleteModels.push({ id: domainId, type: 0 });
          } else if ('UPDATE' == operType) {
            var newName = (null == friendName || '' == friendName) ? domainName : friendName;
            updateModels.push({ id: domainId, type: 0, newName: newName });
          }
        } else if ('NE' == type) {
          var parentId = object['parentId'];
          var neId = object['objId'];
          var neName = object['name'];
          var friendName = object['friendName'];
          var operType = object['operType'];
          var name = '' == friendName ? neName : friendName;
          if ('CREATE' == operType) {
            var newWafTNode = new WafTNode();
            newWafTNode.id = neId;
            newWafTNode.name = name;
            newWafTNode.showname = name;
            newWafTNode.type = 1;
            newWafTNode.imgstyle = { w: 38, h: 46 };
            addModels.push({ model: newWafTNode, parentId: parentId });
          } else if ('DELETE' == operType) {
            deleteModels.push({ id: neId, type: 1 });
          } else if ('UPDATE' == operType) {
            var newName = (null == friendName || '' == friendName) ? domainName : friendName;
            updateModels.push({ id: neId, type: 1, newName: newName });
          }
        }
      }
      this.topologys.toArray()[0].doUpdate(4, null, { 'create': addModels, 'delete': deleteModels, 'update': updateModels }, null, null);
    }
  }

  ngOnInit() {

  }

  OnInit() {

  }

  ngOnDestroy() {
    var me = this;
    console.log('销毁..............');
    this.unSubscribeAlmPass();
    this.treeDataCache.length = 0;
    this.treeAlmDataCache.length = 0;
    this.topoCache.length = 0;
    this.topologys.toArray()[0].destroy();
    if (null != this.oldOnResize) {
      window.onresize = function() {
        me.oldOnResize();
      }
    } else {
      window.onresize = function() {
      }
    }
  }

  unSubscribeAlmPass() {
    this.pushService.unsubscribe(this.nmLamp);
    this.pushService.unsubscribe(this.mainTopo);
    this.pushService.unsubscribe(this.nmObject);
  }

  queryForTopoDatas(objTreeContent: any, action: number) {
    var me = this;
    let req: RequestMsg = new RequestMsg();
    req.res = "/topo/main";
    me.topoLoaded = true;
    this.tpi.getGlobalService().showLoading();
    this.http.post(req).then((req) => {
      this.tpi.getGlobalService().hideLoading();
      if (req.result.code === '10000') {
        console.log('queryForTopoDatas =>', req);
        // 设置拓扑加载完成标示
        me.topoLoaded = false;
        me.handleTopoLoad(objTreeContent, req.content, action);
      } else {
        this.tpi.getGlobalService().errorDialog(me.getI18n("unm.topo.graph.get.fail"));
      }
    });
  }

  handleTopoLoad(objTreeContent: any, content: any, action: number) {
    var me = this;
    // 先处理上报缓存，再处理正常逻辑
    if (me.treeDataCache.length > 0) {
      for (var i = 0; i < me.treeDataCache.length; i++) {
        me.handleNodeVerifyPass(me.treeDataCache[i]);
        me.treeDataCache.splice(i--, 1);
      }
    }
    if (me.treeAlmDataCache.length > 0) {
      for (var i = 0; i < me.treeAlmDataCache.length; i++) {
        me.handleAlmNmLamp(me.treeAlmDataCache[i]);
        me.treeAlmDataCache.splice(i--, 1);
      }
    }
    if (me.topoCache.length > 0) {
      for (var i = 0; i < me.topoCache.length; i++) {
        me.handleTopoAlmPass(me.topoCache[i]);
        me.topoCache.splice(i--, 1);
      }
    }
    var style = new WafTopoStyle();
    /*        style.nodeStyle = new WafNodeStyle();
            style.nodeStyle.showIp = true;*/
    // 设置连线和节点坐标
    me.reConstructTopoNode(objTreeContent, content);
    console.log('this.topoNode = ', this.topoNode);
    if (0 == action) {
      this.topologys.toArray()[0].setDataSource(this.topoNode, style, null, false);
    } else if (1 == action) {
      this.topologys.toArray()[0].setDataSource(this.topoNode, style, null, true);
    }
  }

  ngAfterViewInit() {
    var me = this;
    // 订阅集成配置节点增删改上报接口，但不处理
    this.subscribeNodeVerifyPass();
    // 告警灯上报订阅
    this.subscribeAlmNmLamp();
    this.queryForObjectTree();
    this.resetTopoStyle();
    this.oldOnResize = window.onresize;
    if (typeof this.oldOnResize != 'function') {
      window.onresize = function() {
        me.resetTopoStyle();
      }
    } else {
      window.onresize = function() {
        me.oldOnResize();
        me.resetTopoStyle();
      }
    }
  }

  resetTopoStyle() {
    var shortcut = document.getElementById('shortcut').offsetHeight;
    var menu = document.getElementById('menu').offsetHeight;
    var body = document.body.clientHeight;
    /*   console.log('shortcut height = ', shortcut);
       console.log('menu height = ', menu);
       console.log('body height = ', body);*/
    document.getElementById('topology').style.height = (body - shortcut - menu - 10) + 'px';
  }

  onRefresh($event) {
    console.log('拓扑刷新=>', $event);
    var me = this;
    let req: RequestMsg = new RequestMsg();
    req.res = "/topo/getLogicDomainView?logicDomainId=" + $event.id;
    me.topoRefreshed = true;
    this.tpi.getGlobalService().showLoading();
    this.http.post(req).then((req) => {
      this.tpi.getGlobalService().hideLoading();
      if (req.result.code === '10000') {
        console.log('onRefresh = ', req);
        me.topoRefreshed = false;
        this.handleTopoRefresh($event, req.content);
        this.message.info(me.getI18n("unm.topo.graph.refresh.succeed"));
      } else {
        this.tpi.getGlobalService().errorDialog(me.getI18n("unm.topo.graph.refresh.fail"));
      }
    });
  }

  handleTopoRefresh(topoNodeModel: WafTNode, topoContent: any) {
    var me = this;
    // 先处理上报缓存，再处理正常逻辑
    if (me.treeDataCache.length > 0) {
      for (var i = 0; i < me.treeDataCache.length; i++) {
        me.handleNodeVerifyPass(me.treeDataCache[i]);
        me.treeDataCache.splice(i--, 1);
      }
    }
    if (me.treeAlmDataCache.length > 0) {
      for (var i = 0; i < me.treeAlmDataCache.length; i++) {
        me.handleAlmNmLamp(me.treeAlmDataCache[i]);
        me.treeAlmDataCache.splice(i--, 1);
      }
    }
    if (me.topoCache.length > 0) {
      for (var i = 0; i < me.topoCache.length; i++) {
        me.handleTopoAlmPass(me.topoCache[i]);
        me.topoCache.splice(i--, 1);
      }
    }
    // 处理拓扑刷新(只处理节点坐标刷新,其他丢掉)
    var refreshedTopoModeId = topoContent.id;
    var topoNodeBeans = topoContent.topoNodeBeans;
    var topoLinkBeans = topoContent.topoLinkBeans;
    if (null != topoNodeBeans) {
      var addModels = [];
      var updateModels = [];
      // 轮询刷新后的所有节点，判断add,update
      for (var i = 0; i < topoNodeBeans.length; i++) {
        var tnode = topoNodeModel.findTNodeById(topoNodeBeans[i].id);
        if (tnode != null) {
          // 仅更新坐标
          // update
          tnode.oldCoordinate = { x: topoNodeBeans[i]['point']['x'], y: topoNodeBeans[i]['point']['y'] };
          tnode.coordinate = tnode.oldCoordinate;
          updateModels.push(tnode);
          this.topologys.toArray()[0].doUpdate(2, null, { 'action': 'update', 'model': updateModels }, null, null);
        } else {
          /*// add
          var neNode = new WafTNode;
          neNode.id = topoNodeBeans[i].id;
          if ('TYPE_NE' == topoNodeBeans[i].type) {
            neNode.type = 1;
            neNode.imgsrc = './assets/common/unm_topo/defaultnelogo.svg';
            neNode.showimgsrc = './assets/common/unm_topo/defaultnelogo.svg';
            neNode.imgstyle = {w: 38, h: 46};
          } else if ('TYPE_LOGICDOMAIN' == topoNodeBeans[i].type) {
            neNode.type = 0;
            neNode.imgsrc = './assets/common/unm_topo/logiccollapse.svg';
            neNode.showimgsrc = './assets/common/unm_topo/logiccollapse.svg';
            neNode.imgstyle = {w: 50, h: 50};
          }
          // 这个名称有可能是错的。有效字段就id和point.
          neNode.name = topoNodeBeans[i].name;
          neNode.showname = topoNodeBeans[i].name;
          neNode.oldCoordinate = {x:topoNodeBeans[i].point['x'], y:topoNodeBeans[i].point['y']};
          neNode.coordinate = neNode.oldCoordinate;
          neNode.style = {};
          neNode.painted = false;
          addModels.push(neNode);
        }
        if (addModels.length > 0) {
          this.topologys.toArray()[0].doUpdate(2, null, {'action':'add', 'model':addModels}, null ,null);
        }*/
        }
        // 轮询topoNodeModel,判断delete
        /*var childList = topoNodeModel.childList;
        if (null != childList) {
          var ids = [];
          for (var j = 0; j < childList.length; j++) {
            var exist = false;
            for (var i = 0; i < topoNodeBeans.length; i++) {
              if (topoNodeBeans[i].id == childList[j].id) {
                exist = true;
                break;
              }
            }
            if (false == exist) {
              ids.push(childList[j].id);
            }
          }
          if (ids.length > 0) {
            this.topologys.toArray()[0].doUpdate(2, null, {'action':'delete', 'model':ids}, null ,null);
          }
        }*/
      }
    }
  }

  onSelect($event) {
    if (null != $event) {
      console.log('已获取拓扑图节点点击==>', $event);
      this.topoSelectId = "" + $event.id;
      if ($event.type == 1) {
        this.neId = "" + $event.id;
      }
    }
  }

  onSave($event) {
    var me = this;
    var changedNodes = this.topologys.toArray()[0].getChangedNodes();
    console.log('changedNodes = ', changedNodes);
    let req: RequestMsg = new RequestMsg();
    req.res = "/topo/saveMain";
    req.content = { id: '', topoLinkBeans: [], topoNodeBeans: [] };
    if (null != changedNodes) {
      for (var i = 0; i < changedNodes.length; i++) {
        var type = changedNodes[i].type == 1 ? 'TYPE_NE' : 'TYPE_LOGICDOMAIN';
        var id = changedNodes[i].id;
        var topoNodeBean = { id: id, type: type, point: { x: changedNodes[i].coordinate.x, y: changedNodes[i].coordinate.y } };
        if (null != changedNodes[i].params) {
          for (var key in changedNodes[i].params) {
            topoNodeBean[key] = changedNodes[i].params[key];
          }
        } else {
          // 人为动态补充（对于新增的节点是没有key的）
          topoNodeBean['key'] = { type: "ELEMENT_OBJECT_NODE", id: id }
        }
        req.content.topoNodeBeans.push(topoNodeBean);
      }
    }
    this.tpi.getGlobalService().showLoading();
    this.http.post(req).then((req) => {
      this.tpi.getGlobalService().hideLoading();
      if (req.result.code === '10000') {
        console.log('onSave = ', req);
        this.message.info(me.getI18n("unm.topo.graph.save.succeed"));
        this.topologys.toArray()[0].doUpdate(0, null, null, null, null);
      } else {
        this.tpi.getGlobalService().errorDialog(me.getI18n("unm.topo.graph.save.fail"));
      }
    });
  }

  /**
   * 模拟一个group
   * @returns {WafTNode}
   */
  mockTopoNode() {
    var gTopoNode = new WafTNode();
    gTopoNode.id = '-1';
    gTopoNode.childList = [];
    gTopoNode.oldCoordinate = { x: 100, y: 100 };
    // 一个域
    var topoNode = new WafTNode();
    topoNode.id = 'logic_0';
    topoNode.type = 0;
    topoNode.name = 'group_0';
    topoNode.showname = 'group[100,100]';
    topoNode.imgsrc = './assets/component/topo/logiccollapse.svg';
    topoNode.showimgsrc = './assets/component/topo/logiccollapse.svg';
    topoNode.oldCoordinate = { x: 100, y: 100 };
    topoNode.coordinate = { x: 100, y: 100 };
    topoNode.imgstyle = { w: 50, h: 50 };
    topoNode.parent = gTopoNode;
    topoNode.childList = [];

    // 添加小图标
    var yNodeIcon = new WafTNodeIcon();
    yNodeIcon.imgsrc = './assets/topo/special16/special7.png';
    yNodeIcon.showimgsrc = './assets/topo/special16/special7.png';
    topoNode.iconChildList = [yNodeIcon];

    // 添加子节点
    for (var i = 0; i < 2; i++) {
      var childNode = new WafTNode();
      childNode.id = 'group_0_node_' + i;
      childNode.name = 'group_0_node_' + i;
      childNode.imgsrc = './assets/component/topo/defaultnelogo.svg';
      childNode.showimgsrc = './assets/component/topo/defaultnelogo.svg';
      childNode.imgstyle = { w: 38, h: 46 };
      childNode.type = 1;
      childNode.oldCoordinate = { x: 100 * (i + 1), y: 100 * (i + 1) };
      childNode.coordinate = { x: 100 * (i + 1), y: 100 * (i + 1) };
      childNode.showname = 'node[' + 100 * (i + 1) + ',' + 100 * (i + 1) + ']';
      childNode.parent = topoNode;
      topoNode.childList.push(childNode);
      // 添加小图标
      var nodeIcon = new WafTNodeIcon();
      nodeIcon.imgsrc = './assets/topo/special16/special17.png';
      nodeIcon.showimgsrc = './assets/topo/special16/special17.png';
      var nodeIcon2 = new WafTNodeIcon();
      nodeIcon2.imgsrc = './assets/topo/ma16/ma.png';
      nodeIcon2.showimgsrc = './assets/topo/ma16/ma.png';
      childNode.iconChildList = [nodeIcon, nodeIcon2];
    }

    // 两网元之间添加2条光纤
    for (var i = 0; i < 2; i++) {
      var link = new WafTLink();
      link.leftnode = topoNode.childList[0];
      link.rightnode = topoNode.childList[1];
      link.name = 'inner link ' + i;
      link.showname = 'inner link ' + i;
      if (null == topoNode.childList[0].links) {
        topoNode.childList[0].links = new Array<WafTLink>();
      }
      if (null == topoNode.childList[1].links) {
        topoNode.childList[1].links = new Array<WafTLink>();
      }
      topoNode.childList[0].links.push(link);
      topoNode.childList[1].links.push(link);
    }

    // 一个网元
    var childTopoNode = new WafTNode();
    childTopoNode.id = 'node_0';
    childTopoNode.name = 'node_0';
    childTopoNode.showname = 'node[600,200]';
    childTopoNode.imgsrc = './assets/component/topo/defaultnelogo.svg';
    childTopoNode.showimgsrc = './assets/component/topo/defaultnelogo.svg';
    childTopoNode.imgstyle = { w: 38, h: 46 };
    childTopoNode.type = 1;
    childTopoNode.oldCoordinate = { x: 600, y: 200 };
    childTopoNode.coordinate = { x: 600, y: 200 };
    childTopoNode.parent = gTopoNode;
    // 添加小图标
    var nodeIcon = new WafTNodeIcon();
    nodeIcon.imgsrc = './assets/topo/special16/special17.png';
    nodeIcon.showimgsrc = './assets/topo/special16/special17.png';
    childTopoNode.iconChildList = [nodeIcon];

    // 域间光纤
    for (var i = 0; i < 2; i++) {
      var link = new WafTLink();
      link.leftnode = topoNode;
      link.rightnode = childTopoNode;
      link.name = 'cross link ' + i;
      link.strokecolor = '0, 0, 255';
      link.showname = 'cross link ' + i;
      if (null == topoNode.links) {
        topoNode.links = new Array<WafTLink>();
      }
      if (null == childTopoNode.links) {
        childTopoNode.links = new Array<WafTLink>();
      }
      topoNode.links.push(link);
      childTopoNode.links.push(link);
    }

    gTopoNode.childList.push(topoNode);
    gTopoNode.childList.push(childTopoNode);
    return gTopoNode;
  }

  /**
   * 根据key值获取国际化后的字符串
   * @param {string} key
   * @returns {string}
   */
  getI18n(key: string): string {
    let str = "";
    this.context.getI18n(key).subscribe((value) => {
      str = value;
    })
    return str;
  }
}
