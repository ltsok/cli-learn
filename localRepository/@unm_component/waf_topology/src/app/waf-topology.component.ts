import {Inject, Component, Input, Output, EventEmitter, OnInit, ContentChildren, QueryList} from '@angular/core';
import {WafTopologyService} from "./service/waf-topology.service";

import {constant} from './waf-topology.constant';

import {WafITopoMap} from './interface/waf-itopomap.interface';
import {WafITopoAction} from './interface/waf-itopoaction.interface';

import {WafTopoStyle} from './model/waf-style.model';
import {WafMapStyle} from './model/waf-mapstyle.model';
import {WafNodeStyle} from './model/waf-nodestyle.model';
import {WafLinkStyle} from './model/waf-linkstyle.model';
import {WafRangeStyle} from './model/waf-rangestyle.model';
import {WafLabelStyle} from './model/waf-labelstyle.model';
import {WafTNode} from './model/waf-tnode.model';
import {WafTLink} from './model/waf-tlink.model';
import {WafTNodeIcon} from './model/waf-tnodeicon.model';

import {NzModalService, NzMessageService} from 'ng-zorro-antd';

import {ContextService} from "@waf_service/context";

import * as $ from "jquery";

/**
 * 封装topology组件
 * @export
 * @class WafTopologyComponent
 */
@Component({
  templateUrl: './waf-topology.component.html'
  , styleUrls: ['./waf-topology.component.css']
  , 'selector': 'waf-topology'
})
export class WafTopologyComponent implements OnInit, WafITopoAction {
  @Output() onRefresh: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
  me;
  dataSource;
  selectedTopoNodes;
  selectedTopoLinks;

  topoNodeModel;

  wafTopologyService;
  _currentWafITopoMap: WafITopoMap;

  _thirdparty;

  _dynamicStyle;
  _staticStyle;
  _style;
  _mapStyle;
  _nodeStyle;
  _linkStyle;
  _rangeStyle;
  _labelStyle;

  _width: string;
  _height: string;
  _overViewWidth: string;
  _overViewHeight: string;
  _overViewLocation: number;
  _overViewLeft: string;
  _overViewRight: string = '0px';
  _overViewBottom: string = '0px';

  curPath: any;
  visitedPath: Array<any>;

  /**
   * Creates an instance of WafTopologyComponent.
   * @param {ContextService} context
   * @param {LoggerService} logger
   * @memberof WafTopologyComponent
   */
  constructor(private context: ContextService, @Inject(WafITopoMap) private wafTopoMaps: WafITopoMap[], topologyService: WafTopologyService, private modalService: NzModalService, private message: NzMessageService) {
    this.wafTopologyService = topologyService;
  }

  /**
   * 组件初始化（生命周期）
   * @memberof WafTopologyComponent
   */
  ngOnInit(): void {
    // console.log('ngOnInit!');
  }

  setCurrentWafITopoMap() {
    if (null == this._currentWafITopoMap) {
      if (null != this.wafTopoMaps) {
        for (var i = 0; i < this.wafTopoMaps.length; i++) {
          if (this.wafTopoMaps[i].getThirdParty() == this._thirdparty) {
            this._currentWafITopoMap = this.wafTopoMaps[i];
            this.wafTopologyService.setITopoMap(this._currentWafITopoMap);
            this._currentWafITopoMap.setJTopoAction(this);
            break;
          }
        }
      }
    }
    if (null != this._currentWafITopoMap) {
      this._currentWafITopoMap.addWafTopologyComponent(this);
    }
  }

  @Input()
  set id(flag: string) {
    this.me = flag;
  }

  getId(): string {
    return this.me;
  }

  @Input()
  set mapStyle(flag: string) {
    if (null != flag) {
      this._mapStyle = eval(flag);
    }
  }

  @Input()
  set nodeStyle(flag: string) {
    if (null != flag) {
      this._nodeStyle = eval(flag);
    }
  }

  @Input()
  set linkStyle(flag: string) {
    if (null != flag) {
      this._linkStyle = eval(flag);
    }
  }

  @Input()
  set rangeStyle(flag: string) {
    if (null != flag) {
      this._rangeStyle = eval(flag);
    }
  }

  @Input()
  set labelStyle(flag: string) {
    if (null != flag) {
      this._labelStyle = eval(flag);
    }
  }

  @Input()
  set thirdparty(flag: string) {
    this._thirdparty = flag;
    this.setCurrentWafITopoMap();
  }

  iconSelected(iconIndex: number, execute: boolean) {
    var me = this;
    // 上钻
    if (0 == iconIndex) {
      if (null != this.topoNodeModel && this.topoNodeModel.parent != null) {
        this.wafTopologyService.doUpdate(0, {
          'oldModel': this.topoNodeModel,
          'newModel': this.topoNodeModel.parent
        }, this._style);
        this.topoNodeModel = this.topoNodeModel.parent;
        this.wafTopologyService.centerAndZoom(this.topoNodeModel);
        this.curPath = this.topoNodeModel.id;
      } else {
        this.message.info(me.getI18n("unm.topo.graph.path.top"));
      }
    } else if (1 == iconIndex || 2 == iconIndex || 3 == iconIndex) {
      var ui = document.getElementsByClassName('icon_lists');
      if (null != ui && ui.length == 1) {
        var liList = ui[0].children;
        for (var i = 0; i < liList.length; i++) {
          liList[i]['style']['borderColor'] = 'rgba(228, 228, 228, 1)';
          liList[i]['style']['backgroundColor'] = null;
          liList[i]['style']['borderRightWidth'] = '0px';
          if (i == liList.length - 1) {
            liList[i]['style']['borderRightWidth'] = '1px';
          }
        }
        liList[iconIndex]['style']['borderRightWidth'] = '1px';
        liList[iconIndex]['style']['borderColor'] = '#188FFD';
        liList[iconIndex]['style']['backgroundColor'] = '#dae8fc';
        if (true == execute) {
          this.wafTopologyService.doUpdate(iconIndex, null, this._style);
        }
      }
    } else if (4 == iconIndex) {
      this.wafTopologyService.doUpdate(4, null, this._style);
    } else if (5 == iconIndex) {
      this.wafTopologyService.doUpdate(5, null, this._style);
    } else if (6 == iconIndex) {
      this.wafTopologyService.doUpdate(6, null, this._style);
    } else if (7 == iconIndex) {
      this.modalService.confirm({
        nzTitle: me.getI18n("unm.topo.graph.confirm"),
        nzContent: me.getI18n("unm.topo.graph.refresh.prompt"),
        nzOkText: me.getI18n("unm.topo.graph.confirm"),
        nzCancelText: me.getI18n("unm.topo.graph.cancel"),
        nzOnOk: function () {
          me.onRefresh.emit(me.topoNodeModel);
        }
      });
    } else if (8 == iconIndex) {
      this.modalService.confirm({
        nzTitle: me.getI18n("unm.topo.graph.confirm"),
        nzContent: me.getI18n("unm.topo.graph.save.prompt"),
        nzOkText: me.getI18n("unm.topo.graph.confirm"),
        nzCancelText: me.getI18n("unm.topo.graph.cancel"),
        nzOnOk: function () {
          me.onSave.emit(me.topoNodeModel);
        }
      });
    } else if (9 == iconIndex) {
      this.wafTopologyService.doUpdate(9, {'me': this.me}, this._style);
    }
  }

  setDataSource(dataSource: object, dynamicConfig: WafTopoStyle, selectedNodes: any, clear: boolean) {
    var me = this;
    me.dataSource = dataSource;
    me.setDynamicConfig(dynamicConfig);
    // this.toponode = this.wafTopologyService.convertToTopoNode(dataSource, sysConfig, selectedNodes);
    // me.topoNodeModel = me.wafTopologyService.mockTopoNode(currentLogicId, imgType);
    // me.addListeners();
    // me.onResize(null);
    if (clear) {
      var newTopoNodeModelId = me.topoNodeModel.id;
      me.topoNodeModel = this.wafTopologyService.convertToTopoNode(dataSource, dynamicConfig, selectedNodes);
      me.doUpdate(3, dynamicConfig, {id: newTopoNodeModelId}, null, null);
    } else {
      me.topoNodeModel = this.wafTopologyService.convertToTopoNode(dataSource, dynamicConfig, selectedNodes);
      var returnNodes = me.wafTopologyService.doPaint(me.topoNodeModel, me._style, null, clear);
      /*    if (null != returnNodes) {
            me.selectedTopoNodes = returnNodes;
          }
          this.doAfterInit();*/
      me.wafTopologyService.centerAndZoom(me.topoNodeModel);
      this.visitedPath = [];
      var pathName = this.getPath(this.topoNodeModel);
      this.visitedPath.push({label: pathName, value: me.topoNodeModel.id});
      this.curPath = me.topoNodeModel.id;
    }
  }

  getPath(node: WafTNode) {
    var temp = node;
    var str = '';
    var nameArray = [];
    if (null != temp) {
      while (temp.parent != null) {
        nameArray.push(temp.showname);
        temp = temp.parent;
      }
      nameArray.push(temp.showname);
      for (var i = nameArray.length - 1; i >= 0; i--) {
        str += nameArray[i];
        if (i != 0) {
          str += '/';
        }
      }
    }
    return str;
  }

  contains(array: Array<any>, id: string) {
    if (null != array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].value == id) {
          return true;
        }
      }
    }
    return false;
  }

  pathChanged() {
    console.log('pathChanged');
    var topWafNode = this.getTopWafTNode();
    var oldTopoNodeModel = this.topoNodeModel;
    var newModel = this.getGroupWafTNodeById(topWafNode, this.curPath);
    this.wafTopologyService.doUpdate(0, {'oldModel': oldTopoNodeModel, 'newModel': newModel}, this._style);
    this.topoNodeModel = newModel;
    this.wafTopologyService.centerAndZoom(this.topoNodeModel);
  }

  getGroupWafTNodeById(wafTNode: WafTNode, id: string) {
    if (null != wafTNode) {
      if (wafTNode.id == id) {
        return wafTNode;
      }
      var childNodes = wafTNode.childList;
      if (null != childNodes) {
        for (var i = 0; i < childNodes.length; i++) {
          if (childNodes[i].type != 1) {
            var node = this.getGroupWafTNodeById(childNodes[i], id);
            if (node != null) {
              return node;
            }
          }
        }
      }
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

  setDynamicConfig(dynamicConfig: WafTopoStyle) {
    this._dynamicStyle = dynamicConfig;
    this.resetConfigStyles();
    if (null != this._style['mapStyle']) {
      this._width = this._style['mapStyle']['width'];
      this._height = this._style['mapStyle']['height'];
      this._overViewWidth = this._style['mapStyle']['overViewWidth'];
      this._overViewHeight = this._style['mapStyle']['overViewHeight'];
      this._overViewLocation = this._style['mapStyle']['overViewLocation'];
      if (0 == this._overViewLocation) {
        this._overViewLeft = '0px';
        this._overViewRight = null;
        this._overViewBottom = null;
      } else if (1 == this._overViewLocation) {
        this._overViewLeft = null;
        this._overViewRight = '0px'
        this._overViewBottom = null;
      } else if (2 == this._overViewLocation) {
        this._overViewLeft = null;
        this._overViewRight = '0px'
        this._overViewBottom = '0px';
      } else if (3 == this._overViewLocation) {
        this._overViewLeft = '0px';
        this._overViewRight = null;
        this._overViewBottom = '0px';
      }
    }

    console.log('this._style = ', this._style);
  }

  getChangedNodes() {
    var changedNodes = [];
    this.recChangedNodes(this.getTopWafTNode(), changedNodes);
    return changedNodes;
  }

  getTopWafTNode() {
    var curTopoNode = this.topoNodeModel;
    // 获取顶层域节点
    var preTopoNode = null;
    while (null != curTopoNode) {
      preTopoNode = curTopoNode;
      curTopoNode = curTopoNode.parent;
    }
    return preTopoNode;
  }

  recChangedNodes(tnode: WafTNode, changedNodes: Array<WafTNode>) {
    if (null != tnode) {
      if (null != tnode.parent && (tnode.coordinate.x != tnode.oldCoordinate.x || tnode.coordinate.y != tnode.oldCoordinate.y)) {
        changedNodes.push(tnode);
      }
      var childNodes = tnode.childList;
      if (childNodes) {
        for (var i = 0; i < childNodes.length; i++) {
          this.recChangedNodes(childNodes[i], changedNodes);
        }
      }
    }
  }

  ngAfterViewInit() {
    this.resetConfigStyles();
    this.iconSelected(1, false);
  }

  copyProperties(srcMap, destMap) {
    if (null != srcMap) {
      for (var key in srcMap) {
        destMap[key] = srcMap[key];
      }
    }
  }

  /**
   * 将系统配置和三方组件配置进行过滤。
   */
  resetConfigStyles() {
    if (null == this._style) {
      this._style = new WafTopoStyle();
      // 1. 从concreteMap中注入
      var staticStyle = this._currentWafITopoMap.getStaticStyle();
      this._style.mapStyle = staticStyle['mapStyle'];
      this._style.nodeStyle = staticStyle['nodeStyle'];
      this._style.linkStyle = staticStyle['linkStyle'];
      this._style.rangeStyle = staticStyle['rangeStyle'];
      this._style.labelStyle = staticStyle['labelStyle'];
      // 2. 从实例配置中注入
      if (this._mapStyle && null != this._mapStyle) {
        if (null != this._style.mapStyle) {
          this.copyProperties(this._mapStyle, this._style.mapStyle);
        } else {
          this._style.mapStyle = new WafMapStyle();
          this.copyProperties(this._mapStyle, this._style.mapStyle);
        }
      } else {
        if (null == this._style.mapStyle) {
          this._style.mapStyle = new WafMapStyle();
        }
      }
      if (this._nodeStyle && null != this._nodeStyle) {
        if (null != this._style.nodeStyle) {
          this.copyProperties(this._nodeStyle, this._style.nodeStyle);
        } else {
          this._style.nodeStyle = new WafNodeStyle();
          this.copyProperties(this._nodeStyle, this._style.nodeStyle);
        }
      } else {
        if (null == this._style.nodeStyle) {
          this._style.nodeStyle = new WafNodeStyle();
        }
      }
      if (this._linkStyle && null != this._linkStyle) {
        if (null != this._style.linkStyle) {
          this.copyProperties(this._linkStyle, this._style.linkStyle);
        } else {
          this._style.linkStyle = new WafLinkStyle();
          this.copyProperties(this._linkStyle, this._style.linkStyle);
        }
      } else {
        if (null == this._style.linkStyle) {
          this._style.linkStyle = new WafLinkStyle();
        }
      }
      if (this._rangeStyle && null != this._rangeStyle) {
        if (null != this._style.rangeStyle) {
          this.copyProperties(this._rangeStyle, this._style.rangeStyle);
        } else {
          this._style.rangeStyle = new WafRangeStyle();
          this.copyProperties(this._rangeStyle, this._style.rangeStyle);
        }
      } else {
        if (null == this._style.rangeStyle) {
          this._style.rangeStyle = new WafRangeStyle();
        }
      }
      if (this._labelStyle && null != this._labelStyle) {
        if (null != this._style.labelStyle) {
          this.copyProperties(this._labelStyle, this._style.labelStyle);
        } else {
          this._style.labelStyle = new WafLabelStyle();
          this.copyProperties(this._labelStyle, this._style.labelStyle);
        }
      } else {
        if (null == this._style.labelStyle) {
          this._style.labelStyle = new WafLabelStyle();
        }
      }
    } else if (null != this._dynamicStyle) {
      // 动态注入
      var dynamicStyle = this._dynamicStyle;
      if (dynamicStyle.mapStyle && null != dynamicStyle.mapStyle) {
        this.copyProperties(dynamicStyle.mapStyle, this._style.mapStyle);
      }
      if (dynamicStyle.nodeStyle && null != dynamicStyle.nodeStyle) {
        this.copyProperties(dynamicStyle.nodeStyle, this._style.nodeStyle);
      }
      if (dynamicStyle.linkStyle && null != dynamicStyle.linkStyle) {
        this.copyProperties(dynamicStyle.linkStyle, this._style.linkStyle);
      }
      if (dynamicStyle.rangeStyle && null != dynamicStyle.rangeStyle) {
        this.copyProperties(dynamicStyle.rangeStyle, this._style.rangeStyle);
      }
      if (dynamicStyle.labelStyle && null != dynamicStyle.labelStyle) {
        this.copyProperties(dynamicStyle.labelStyle, this._style.labelStyle);
      }
    }
  }

  doUpdate(action: number, dynamicConfig: WafTopoStyle, params: any, selectedNodes: Array<WafTNode>, selectedLinks: Array<WafTLink>) {
    var me = this;
    if (0 == action) {
      var changeNodes = this.getChangedNodes();
      if (null != changeNodes) {
        for (var i = 0; i < changeNodes.length; i++) {
          changeNodes[i].oldCoordinate.x = changeNodes[i].coordinate.x;
          changeNodes[i].oldCoordinate.y = changeNodes[i].coordinate.y;
        }
      }
    } else if (1 == action) {
      var id = params['id'];
      var topWafNode = this.getTopWafTNode();
      var wafTNode = this.getWafTNodeById(topWafNode, id);
      if (null != wafTNode) {
        var oldTopoNodeModel = this.topoNodeModel;
        var newModel = wafTNode.parent;
        this.wafTopologyService.doUpdate(0, {
          'oldModel': oldTopoNodeModel,
          'newModel': newModel,
          'selectedNodes': [wafTNode]
        }, this._style);
        this.topoNodeModel = newModel;
        this.wafTopologyService.centerAndZoom(this.topoNodeModel);
        this.handlePath();
      }
    } else if (2 == action) {
      var id = params['id'];
      var doAction = params['action'];
      if ('add' == doAction) {
        var newModels = params['model'];
        if (null != newModels) {
          if (this.topoNodeModel.childList == null) {
            this.topoNodeModel.childList = new Array<WafTNode>();
          }
          for (var i = 0; i < newModels.length; i++) {
            this.topoNodeModel.childList.push(newModels[i]);
            newModels[i].parent = this.topoNodeModel;
          }
        }
      } else if ('delete' == doAction) {
        var ids = params['model'];
        if (null != this.topoNodeModel) {
          if (this.topoNodeModel.childList != null) {
            for (var i = 0; i < ids.length; i++) {
              var deleteModel = this.topoNodeModel.findTNodeById(ids[i]);
              deleteModel['deleted'] = true;
            }
          }
        }
      } else if ('update' == doAction) {
        var updateModels = params['model'];
        if (null != this.topoNodeModel) {
          if (this.topoNodeModel.childList != null && null != updateModels) {
            for (var i = 0; i < updateModels.length; i++) {
              var originalModel = this.topoNodeModel.findTNodeById(updateModels[i].id);
              if (null != originalModel) {
                originalModel.coordinate = updateModels[i].coordinate;
                originalModel.oldCoordinate = updateModels[i].oldCoordinate;
              }
            }
          }
        }
      }
      this.wafTopologyService.doUpdate(10, {'model': this.topoNodeModel}, this._style);
      this.wafTopologyService.centerAndZoom(this.topoNodeModel);
    } else if (3 == action) {
      var id = params['id'];
      var topWafNode = this.getTopWafTNode();
      var wafTNode = this.getWafTNodeById(topWafNode, id);
      if (null != wafTNode) {
        var oldTopoNodeModel = this.topoNodeModel;
        var newModel = wafTNode;
        this.wafTopologyService.doUpdate(0, {
          'oldModel': oldTopoNodeModel,
          'newModel': newModel,
          'selectedNodes': [wafTNode]
        }, this._style);
        this.topoNodeModel = newModel;
        this.wafTopologyService.centerAndZoom(this.topoNodeModel);
        this.handlePath();
      }
    } else if (4 == action) {
      var createModels = params['create'];
      var deleteModels = params['delete'];
      var updateModels = params['update'];
      var topWafNode = this.getTopWafTNode();
      for (var i = 0; i < createModels.length; i++) {
        var parentId = createModels[i].parentId;
        var model = createModels[i].model;
        var modelId = model.id;
        var addNode = this.getWafTNodeById(topWafNode, modelId);
        // 判断存在性
        if (null != addNode) {
          console.log('检测到网元已存在，不处理=>', modelId);
          continue;
        }
        if (null != parentId) {
          var topWafNode = this.getTopWafTNode();
          var parentTopoNode = this.getWafTNodeById(topWafNode, parentId);
          if (null == parentTopoNode.childList) {
            parentTopoNode.childList = new Array<WafTNode>();
          }
          model.oldCoordinate = parentTopoNode.oldCoordinate;
          model.coordinate = parentTopoNode.coordinate;
          model.parent = parentTopoNode;
          parentTopoNode.childList.push(model);
          // 如果新增的域在当前域下可视，则需要添加
          if (this.topoNodeModel == parentTopoNode) {
            this.wafTopologyService.doUpdate(11, {'model': model}, this._style);
          }
        }
      }
      // 刷新访问路径
      this.refreshPath(0, deleteModels, null);
      for (var i = 0; i < deleteModels.length; i++) {
        var type = deleteModels[i].type;
        var id = deleteModels[i].id;
        var delNode = this.getWafTNodeById(topWafNode, id);
        // 判断存在性
        if (null != delNode) {
          if (1 == type) {
            var wafTNode = this.getWafTNodeById(topWafNode, id);
            var parentTopoNode = wafTNode.parent;
            if (null != parentTopoNode) {
              parentTopoNode.removeChildTNodeById(id);
            }
            // 如果删除的网元在当前域下可视，则需要删除
            if (this.topoNodeModel == parentTopoNode) {
              this.wafTopologyService.doUpdate(12, {'model': wafTNode}, this._style);
            }
          } else {
            var topWafNode = this.getTopWafTNode();
            var wafTNode = this.getWafTNodeById(topWafNode, id);
            var parentTopoNode = wafTNode.parent;
            if (null != parentTopoNode) {
              // 将逻辑域下的所有子节点保留
              var deleteWafTNodeChildList = wafTNode.childList;
              var toAddNodeList = [];
              if (null != deleteWafTNodeChildList) {
                if (null == parentTopoNode.childList) {
                  parentTopoNode.childList = new Array<WafTNode>();
                }
                for (var t = 0; t < deleteWafTNodeChildList.length; t++) {
                  deleteWafTNodeChildList[t].parent = parentTopoNode;
                  deleteWafTNodeChildList[t].painted = false;
                  deleteWafTNodeChildList[t].realnode = null;
                  parentTopoNode.childList.push(deleteWafTNodeChildList[t]);
                  toAddNodeList.push(deleteWafTNodeChildList[t]);
                }
              }
              parentTopoNode.removeChildTNodeById(id);
              // 如果删除的域在当前域下可视，则需要添加
              if (this.topoNodeModel == parentTopoNode) {
                for (var t2 = 0; t2 < toAddNodeList.length; t2++) {
                  this.wafTopologyService.doUpdate(11, {'model': toAddNodeList[t2]}, this._style);
                }
                // 添加光纤
                for (var t3 = 0; t3 < toAddNodeList.length; t3++) {
                  var links = toAddNodeList[t3].links;
                  if (null != links) {
                    for (var t4 = 0; t4 < links.length; t4++) {
                      this.wafTopologyService.doUpdate(13, {'model': links[t4]}, this._style);
                    }
                  }
                }
                this.wafTopologyService.doUpdate(12, {'model': wafTNode}, this._style);
              }
              // 如果删除的域是当前域，则路径需要上移一级
              if (this.topoNodeModel == wafTNode) {
                this.curPath = parentTopoNode.id;
                const modal = this.modalService.success({
                  nzTitle: me.getI18n("unm.topo.graph.alert"),
                  nzContent: me.getI18n("unm.topo.graph.path.up")
                });
                // window.setTimeout(() => modal.destroy(), 1000);
                this.topoNodeModel = parentTopoNode;
                this.wafTopologyService.doUpdate(0, {'newModel': this.topoNodeModel}, this._style);
                this.wafTopologyService.centerAndZoom(this.topoNodeModel);
              }
              // 判断域是否存在光纤连线
              var wafTNodeLinks = wafTNode.links;
              if (null != wafTNodeLinks) {
                for (var j = 0; j < wafTNodeLinks.length; j++) {
                  var tLink = wafTNodeLinks[j];
                  var leftNeNode = wafTNodeLinks[j].leftNeNode;
                  var rightNeNode = wafTNodeLinks[j].rightNeNode;
                  var leftnode = wafTNodeLinks[j].leftnode;
                  var rightnode = wafTNodeLinks[j].rightnode;
                  if (wafTNode == leftnode) {
                    // 判断域内连纤网元是否存在其下一级
                    var newLeftNode = parentTopoNode.findTNodeById(leftNeNode.id);
                    if (null != newLeftNode) {
                      // 若存在，则需要建立连纤
                      var link = new WafTLink();
                      link.id = wafTNodeLinks[j].id;
                      link.leftnode = newLeftNode;
                      link.rightnode = wafTNodeLinks[j].rightnode;
                      link.leftNeNode = wafTNodeLinks[j].leftNeNode;
                      link.rightNeNode = wafTNodeLinks[j].rightNeNode;
                      link.name = wafTNodeLinks[j].name;
                      link.strokecolor = wafTNodeLinks[j].strokecolor;
                      link.showname = wafTNodeLinks[j].name;
                      // 如果当前视图连纤可见，还需从界面移除
                      if (parentTopoNode == this.topoNodeModel) {
                        this.wafTopologyService.doUpdate(15, {'model': tLink}, this._style);
                        this.wafTopologyService.doUpdate(13, {'model': link}, this._style);
                      }
                      // 先删旧的，再加新的
                      leftnode.removeTLinkById(link.id);
                      rightnode.removeTLinkById(link.id);
                      newLeftNode.addTLink(link);
                      rightnode.addTLink(link);
                      // 判断是否删除向上连纤图标
                      var iconChildList = newLeftNode.iconChildList;
                      if (null != iconChildList) {
                        var upIcon = newLeftNode.getIcon(1);
                        if (null != upIcon) {
                          let exist = newLeftNode.judgeIfHasUpLink(newLeftNode);
                          if (!exist) {
                            upIcon.deleted = true;
                            this.wafTopologyService.doUpdate(16, {
                              'curModel': this.topoNodeModel,
                              'model': newLeftNode
                            }, this._style);
                          }
                        }
                      }
                    } else {
                      var leftNeNodeParents = leftNeNode.getParents(leftNeNode);
                      var newLeftNode = null;
                      if (null != leftNeNodeParents) {
                        for (var k = 0; k < leftNeNodeParents.length; k++) {
                          if (leftNeNodeParents[k].parent == parentTopoNode) {
                            newLeftNode = leftNeNodeParents[k];
                            break;
                          }
                        }
                      }
                      if (null != newLeftNode) {
                        // 若存在，则需要建立连纤
                        var link = new WafTLink();
                        link.id = wafTNodeLinks[j].id;
                        link.leftnode = newLeftNode;
                        link.rightnode = wafTNodeLinks[j].rightnode;
                        link.leftNeNode = wafTNodeLinks[j].leftNeNode;
                        link.rightNeNode = wafTNodeLinks[j].rightNeNode;
                        link.name = wafTNodeLinks[j].name;
                        link.strokecolor = wafTNodeLinks[j].strokecolor;
                        link.showname = wafTNodeLinks[j].name;
                        // 如果当前视图连纤可见，还需从界面移除
                        if (parentTopoNode == this.topoNodeModel) {
                          this.wafTopologyService.doUpdate(15, {'model': tLink}, this._style);
                          this.wafTopologyService.doUpdate(13, {'model': link}, this._style);
                        }
                        // 先删旧的，再加新的
                        leftnode.removeTLinkById(link.id);
                        rightnode.removeTLinkById(link.id);
                        newLeftNode.addTLink(link);
                        rightnode.addTLink(link);
                        // 判断是否删除向上连纤图标
                        var iconChildList = newLeftNode.iconChildList;
                        if (null != iconChildList) {
                          var upIcon = newLeftNode.getIcon(1);
                          if (null != upIcon) {
                            let exist = newLeftNode.judgeIfHasUpLink(newLeftNode);
                            if (!exist) {
                              upIcon.deleted = true;
                              this.wafTopologyService.doUpdate(16, {
                                'curModel': this.topoNodeModel,
                                'model': newLeftNode
                              }, this._style);
                            }
                          }
                        }
                      }
                    }
                  } else if (wafTNode == rightnode) {
                    // 判断域内连纤网元是否存在其下一级
                    var newRightNode = parentTopoNode.findTNodeById(rightNeNode.id);
                    if (null != newRightNode) {
                      // 若存在，则需要建立连纤
                      var link = new WafTLink();
                      link.id = wafTNodeLinks[j].id;
                      link.rightnode = newRightNode;
                      link.leftnode = wafTNodeLinks[j].leftnode;
                      link.leftNeNode = wafTNodeLinks[j].leftNeNode;
                      link.rightNeNode = wafTNodeLinks[j].rightNeNode;
                      link.name = wafTNodeLinks[j].name;
                      link.strokecolor = wafTNodeLinks[j].strokecolor;
                      link.showname = wafTNodeLinks[j].name;
                      // 如果当前视图连纤可见，还需从界面移除
                      if (parentTopoNode == this.topoNodeModel) {
                        this.wafTopologyService.doUpdate(15, {'model': tLink}, this._style);
                        this.wafTopologyService.doUpdate(13, {'model': link}, this._style);
                      }
                      // 先删旧的，再加新的
                      leftnode.removeTLinkById(link.id);
                      rightnode.removeTLinkById(link.id);
                      newRightNode.addTLink(link);
                      leftnode.addTLink(link);
                      // 删除向上连纤图标
                      var iconChildList = newRightNode.iconChildList;
                      if (null != iconChildList) {
                        var upIcon = newRightNode.getIcon(1);
                        if (null != upIcon) {
                          let exist = newRightNode.judgeIfHasUpLink(newRightNode);
                          if (!exist) {
                            upIcon.deleted = true;
                            this.wafTopologyService.doUpdate(16, {
                              'curModel': this.topoNodeModel,
                              'model': newRightNode
                            }, this._style);
                          }
                        }
                      }
                    } else {
                      var rightNeNodeParents = rightNeNode.getParents(rightNeNode);
                      var newRightNode = null;
                      if (null != rightNeNodeParents) {
                        for (var k = 0; k < rightNeNodeParents.length; k++) {
                          if (rightNeNodeParents[k].parent == parentTopoNode) {
                            newRightNode = rightNeNodeParents[k];
                            break;
                          }
                        }
                      }
                      if (null != newRightNode) {
                        // 若存在，则需要建立连纤
                        var link = new WafTLink();
                        link.id = wafTNodeLinks[j].id;
                        link.rightnode = newRightNode;
                        link.leftnode = wafTNodeLinks[j].leftnode;
                        link.leftNeNode = wafTNodeLinks[j].leftNeNode;
                        link.rightNeNode = wafTNodeLinks[j].rightNeNode;
                        link.name = wafTNodeLinks[j].name;
                        link.strokecolor = wafTNodeLinks[j].strokecolor;
                        link.showname = wafTNodeLinks[j].name;
                        // 如果当前视图连纤可见，还需从界面移除
                        if (parentTopoNode == this.topoNodeModel) {
                          this.wafTopologyService.doUpdate(15, {'model': tLink}, this._style);
                          this.wafTopologyService.doUpdate(13, {'model': link}, this._style);
                        }
                        // 先删旧的，再加新的
                        leftnode.removeTLinkById(link.id);
                        rightnode.removeTLinkById(link.id);
                        newRightNode.addTLink(link);
                        leftnode.addTLink(link);
                        // 删除向上连纤图标
                        var iconChildList = newRightNode.iconChildList;
                        if (null != iconChildList) {
                          var upIcon = newRightNode.getIcon(1);
                          if (null != upIcon) {
                            let exist = newRightNode.judgeIfHasUpLink(newRightNode);
                            if (!exist) {
                              upIcon.deleted = true;
                              this.wafTopologyService.doUpdate(16, {
                                'curModel': this.topoNodeModel,
                                'model': newRightNode
                              }, this._style);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            console.log('after update==>', this.topoNodeModel);
          }
        } else {
          console.log('检测到网元不存在，不处理=>', id);
        }
      }
      if (deleteModels.length > 0) {
        this.refreshPath(1, null, null);
      }
      if (null != updateModels) {
        var topWafNode = this.getTopWafTNode();
        for (var i = 0; i < updateModels.length; i++) {
          var wafTNode = this.getWafTNodeById(topWafNode, updateModels[i].id);
          if (null != wafTNode) {
            wafTNode.name = updateModels[i].newName;
            wafTNode.showname = updateModels[i].newName;
            // 逻辑域名称修改之后路径的修改
            this.refreshPath(2, null ,{id:updateModels[i].id});
            // 如果更新的节点在当前域下可视，则需要更新
            if (this.topoNodeModel == wafTNode.parent) {
              this.wafTopologyService.doUpdate(18, {'model': wafTNode}, this._style);
            }
          } else {
            console.log('检测到节点不存在，不处理=>', updateModels[i].id);
          }
        }
      }
    } else if (5 == action) {
      var createModels = params['create'];
      var deleteModels = params['delete'];
      if (null != createModels) {
        var topWafNode = this.getTopWafTNode();
        for (var index = 0; index < createModels.length; index++) {
          var startNodeId = createModels[index].startNodeId;
          var endNodeId = createModels[index].endNodeId;
          var linkId = createModels[index].id;
          var linkName = createModels[index].name;
          var leftWafNode = this.getWafTNodeById(topWafNode, startNodeId);
          var rightWafNode = this.getWafTNodeById(topWafNode, endNodeId);
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
                    // 判断是否已存在
                    var links = leftWafNodeParents[i].links;
                    let exist = false;
                    if (null != links) {
                      for (var k = 0; k < links.length; k++) {
                        if (links[k].id == linkId) {
                          exist = true;
                          break;
                        }
                      }
                    }
                    if (!exist) {
                      var link = new WafTLink();
                      link.id = linkId;
                      link.leftnode = leftWafNodeParents[i];
                      link.rightnode = rightWafNodeParents[j];
                      link.leftNeNode = leftWafNode;
                      link.rightNeNode = rightWafNode;
                      link.name = createModels[index].name;
                      link.strokecolor = '0, 0, 255';
                      link.showname = createModels[index].name;
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
                      // 若添加的连线在当前域可视，可需要添加
                      if (null != lastLeftWafNode && lastLeftWafNode.parent != null && lastLeftWafNode.parent == this.topoNodeModel) {
                        this.wafTopologyService.doUpdate(13, {'model': link}, this._style);
                      }
                    }
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
                  wafTNodeIcon.params = {'position': 1};
                  wafTNodeIcon.parent = curNode;
                  curNode.iconChildList.push(wafTNodeIcon);
                  // 若携带向上连线的节点处在当前可视区域内，则需要添加小图标
                  if (curNode.parent == this.topoNodeModel) {
                    this.wafTopologyService.doUpdate(14, {'model': curNode, 'icon': wafTNodeIcon}, this._style);
                  }
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
                  wafTNodeIcon.params = {'position': 1};
                  wafTNodeIcon.parent = curNode;
                  curNode.iconChildList.push(wafTNodeIcon);
                  // 若携带向上连线的节点处在当前可视区域内，则需要添加小图标
                  if (curNode.parent == this.topoNodeModel) {
                    this.wafTopologyService.doUpdate(14, {'model': curNode, 'icon': wafTNodeIcon}, this._style);
                  }
                }
                curNode = curNode.parent;
              }
            }
          }
        }
      }
      if (null != deleteModels) {
        var topWafNode = this.getTopWafTNode();
        for (var index = 0; index < deleteModels.length; index++) {
          var linkId = deleteModels[index].id;
          // 全网遍历，找到存在该光纤的节点
          var tlink = topWafNode.findTLinkById(topWafNode, linkId);
          if (null != tlink) {
            var leftWafNode = tlink.leftnode;
            var rightWafNode = tlink.rightnode;
            var leftNeWafNode = tlink.leftNeNode;
            var rightNeWafNode = tlink.rightNeNode;
            console.log('delete leftWafNode->', leftWafNode);
            console.log('delete rightWafNode->', rightWafNode);
            // 删除连线
            if (null != leftWafNode && null != rightWafNode) {
              // 若连线在当前域下可视，则需要删除
              if (leftWafNode.parent == this.topoNodeModel) {
                this.wafTopologyService.doUpdate(15, {'model': tlink}, this._style);
              }
              leftWafNode.removeTLinkById(linkId);
              rightWafNode.removeTLinkById(linkId);
            }
            // 连纤节点直至网元节点的中间节点需要判断是否删除向上连纤小图标
            if (null != leftWafNode && null != leftNeWafNode) {
              if (leftWafNode.type != 1) {
                // 处理左侧逻辑域和网元的向上连纤
                let exist = leftNeWafNode.judgeIfHasUpLink(leftNeWafNode);
                // 若不存在，则需删除网元的向上连纤小图标
                if (!exist) {
                  console.log('currentTopoNodeModel：', this.topoNodeModel);
                  console.log('leftNeWafNode需要删除小图标，网元为：', leftNeWafNode.showname);
                  var iconChildList = leftNeWafNode.iconChildList;
                  if (null != iconChildList) {
                    var upIcon = leftNeWafNode.getIcon(1);
                    if (null != upIcon) {
                      upIcon.deleted = true;
                    }
                  }
                  this.wafTopologyService.doUpdate(16, {
                    'curModel': this.topoNodeModel,
                    'model': leftNeWafNode
                  }, this._style);
                }
                // 处理逻辑域
                curNode = leftNeWafNode.parent;
                while (null != curNode && curNode != leftWafNode) {
                  // 处理逻辑域的向上连纤
                  let exist = curNode.judgeIfHasUpLink(curNode);
                  // 若不存在，则需删除网元的向上连纤小图标
                  if (!exist) {
                    console.log('currentTopoNodeModel：', this.topoNodeModel);
                    console.log('curNode逻辑域需要删除小图标，网元为：', curNode.showname);
                    var iconChildList = curNode.iconChildList;
                    if (null != iconChildList) {
                      var upIcon = curNode.getIcon(1);
                      if (null != upIcon) {
                        upIcon.deleted = true;
                      }
                    }
                    this.wafTopologyService.doUpdate(16, {
                      'curModel': this.topoNodeModel,
                      'model': curNode
                    }, this._style);
                  }
                  curNode = curNode.parent;
                }
              }
            }
            if (null != rightWafNode && null != rightNeWafNode) {
              if (rightWafNode.type != 1) {
                // 处理右侧逻辑域和网元的向上连纤
                var curNode = rightNeWafNode.parent;
                // 处理网元
                let exist = rightNeWafNode.judgeIfHasUpLink(rightNeWafNode);
                // 若不存在，则需删除网元的向上连纤小图标
                if (!exist) {
                  console.log('currentTopoNodeModel：', this.topoNodeModel);
                  console.log('rightNeWafNode需要删除小图标，网元为：', rightNeWafNode.showname);
                  var iconChildList = rightNeWafNode.iconChildList;
                  if (null != iconChildList) {
                    var upIcon = rightNeWafNode.getIcon(1);
                    if (null != upIcon) {
                      upIcon.deleted = true;
                    }
                  }
                  this.wafTopologyService.doUpdate(16, {
                    'curModel': this.topoNodeModel,
                    'model': rightNeWafNode
                  }, this._style);
                }
                // 处理逻辑域
                curNode = rightNeWafNode.parent;
                while (null != curNode && curNode != rightWafNode) {
                  // 处理逻辑域的向上连纤
                  let exist = curNode.judgeIfHasUpLink(curNode);
                  // 若不存在，则需删除网元的向上连纤小图标
                  if (!exist) {
                    console.log('currentTopoNodeModel：', this.topoNodeModel);
                    console.log('curNode逻辑域需要删除小图标，网元为：', curNode.showname);
                    var iconChildList = curNode.iconChildList;
                    if (null != iconChildList) {
                      var upIcon = curNode.getIcon(1);
                      if (null != upIcon) {
                        upIcon.deleted = true;
                      }
                    }
                    this.wafTopologyService.doUpdate(16, {
                      'curModel': this.topoNodeModel,
                      'model': curNode
                    }, this._style);
                  }
                  curNode = curNode.parent;
                }
              }
            }
          }
        }
      }
    } else if (6 == action) {
      var topWafNode = this.getTopWafTNode();
      var updateModels = params['model'];
      if (null != updateModels) {
        for (var i = 0; i < updateModels.length; i++) {
          var tNode = this.getWafTNodeById(topWafNode, updateModels[i].id);
          if (null != tNode) {
            console.log('已发现待更新的告警节点：', tNode.showname);
            if (tNode.parent != null) {
              tNode.imgsrc = updateModels[i].params.imgSrc;
              tNode.showimgsrc = updateModels[i].params.imgSrc;
              if (null == tNode.style) {
                tNode.style = {};
              }
              tNode.style.borderColor = updateModels[i].params.borderColor;
              tNode.addOrUpdateIcon(0, updateModels[i].params.specialImgSrc);
              tNode.addOrUpdateIcon(0.5, updateModels[i].params.maImgSrc);
              // 如果修改的节点在当前域可视，则需要更新拓扑图
              if (tNode.parent == this.topoNodeModel) {
                this.wafTopologyService.doUpdate(17, {'model': tNode}, this._style);
                var icons = [];
                var node = tNode.realnode;
                if (null != node && node['bindingUIs']) {
                  node['bindingUIs'].forEach(function (ui) {
                    icons.push(ui.ui);
                  });
                }
                var iconChildList = tNode.iconChildList;
                if (null != iconChildList && null != icons) {
                  for (var k = 0; k < iconChildList.length; k++) {
                    tNode.iconChildList[k].painted = true;
                    tNode.iconChildList[k].realnodeicon = icons[k];
                  }
                }
              } else {
                var iconChildList = tNode.iconChildList;
                if (null != iconChildList) {
                  for (var k = 0; k < iconChildList.length; k++) {
                    if (iconChildList[k].deleted == true) {
                      tNode.iconChildList.splice(k--, 1);
                    }
                  }
                }
              }
            }
          } else {
            console.log('未发现待更新的告警节点，id = ', updateModels[i].id);
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

  refreshPath(action: number, deleteModels: Array<any>, params:any) {
    var topWafNode = this.getTopWafTNode();
    // 逻辑域删除后的刷新
    if (0 == action) {
      if (null != deleteModels && null != this.visitedPath) {
        for (var i = 0; i < deleteModels.length; i++) {
          for (var j = 0; j < this.visitedPath.length; j++) {
            if (deleteModels[i].id == this.visitedPath[j].value) {
              // 更新id和label
              var curNode = this.getWafTNodeById(topWafNode, deleteModels[i].id);
              if (null != curNode) {
                var newCurNode = curNode.parent;
                var newPathName = this.getPath(newCurNode);
                this.visitedPath.splice(j, 1, {label: newPathName, value: newCurNode.id});
                break;
              }
            }
          }
        }
      }
    } else if (1 == action) {
      var array = [];
      for (var i = 0; i < this.visitedPath.length; i++) {
        // 更新id和label
        var curNode = this.getWafTNodeById(topWafNode, this.visitedPath[i].value);
        if (null != curNode) {
          // 去重
          if (i == 0) {
            var newPathName = this.getPath(curNode);
            var item = {label: newPathName, value: curNode.id};
            array.push(item);
            this.visitedPath.splice(i, 1, item);
          } else {
            if (!this.contains(array, curNode.id)) {
              var newPathName = this.getPath(curNode);
              var item = {label: newPathName, value: curNode.id};
              array.push(item);
              this.visitedPath.splice(i, 1, item);
            } else {
              this.visitedPath.splice(i--, 1);
            }
          }
        }
      }
    } else if (2 == action) {
      // 逻辑域名称修改之后路径的修改
      if (null != this.visitedPath) {
        var id = params['id'];
        for (var i = 0; i < this.visitedPath.length; i++) {
          if (this.visitedPath[i].value == id) {
            var curNode = this.getWafTNodeById(topWafNode, id);
            var newPathName = this.getPath(curNode);
            this.visitedPath[i].label = newPathName;
          }
        }
      }
    }
  }

  handlePath() {
    var path = this.getPath(this.topoNodeModel);
    if (!this.contains(this.visitedPath, this.topoNodeModel.id)) {
      if (this.visitedPath.length < 8) {
        this.visitedPath.push({label: path, value: this.topoNodeModel.id});
      } else {
        this.visitedPath.splice(1, 1);
        this.visitedPath.push({label: path, value: this.topoNodeModel.id});
      }
    }
    this.curPath = this.topoNodeModel.id;
  }

  doAfterInit() {
    var me = this;
  }

  destroy() {
    this.wafTopologyService.destroy();
  }

  onResize(target: Object): void {

  }

  addListeners(): void {

  }

  onMapLoaded() {

  }

  onMapDblClick() {

  }

  onMapClick(target) {
  }

  onMapMove(top, left) {
  }

  onMapZoomable(flag) {
  }

  onNodeClick(target, top, left) {
    if (null != target) {
      var nodeModel = target['model'];
      this.onSelect.emit({id:nodeModel.id, type:nodeModel.type});
    }
  }

  onNodeDblClick(target) {
    console.log('onNodeDblClick target = ', target);
    var model = target['model'];
    if (model != null && model.type == 0) {
      this.wafTopologyService.doUpdate(0, {'oldModel': this.topoNodeModel, 'newModel': model}, this._style);
      this.topoNodeModel = model;
      this.wafTopologyService.centerAndZoom(this.topoNodeModel);
      this.handlePath();
    }
  }

  onNodeMouseDown(target) {
  }

  onNodeMouseUp(target, top, left) {
  }

  onNodeMouseOver(target) {
  }

  onNodeMouseOut(target) {
  }

  onNodeMouseMove(target, top, left) {
  }

  onNodeMouseDragStart(target) {
  }

  onNodeMouseDragEnd(target) {
    console.log('onNodeMouseDragEnd = ', target);
    if (null != target) {
      this.wafTopologyService.doUpdate(8, {'model': target}, this._style);
    }
  }

  onNodeMouseDragging(target) {
  }

  onLinkClick(target, top, left) {
  }

  onLinkDblClick(target) {
  }

  onLinkMouseOver(target, top, left) {
  }

  onLinkMouseOut(target) {
  }

  onLinkMouseMove(target, top, left) {
  }

  onRangeMouseOver(target) {
  }

  onRangeMouseOut(target) {
  }

  onRangeMouseMove(target) {
  }

  onRangeMouseDown(target) {
  }

  onRangeMouseUp(target) {
  }

  onRangeDbClick(target) {
  }

  onPortClick(target) {
  }

  onPortDblClick(target) {
  }

  onPortMouseOver(target) {
  }

  onPortMouseOut(target) {
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
