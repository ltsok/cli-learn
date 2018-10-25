import { WafITopoMap } from './interface/waf-itopomap.interface';
import { WafITopoAction } from './interface/waf-itopoaction.interface';

import { WafTNode } from './model/waf-tnode.model';
import { WafTLink } from './model/waf-tlink.model';
import { WafTRange } from './model/waf-trange.model';
import { WafTLabel } from './model/waf-tlabel.model';

import { WafTopoStyle } from './model/waf-style.model';
import { WafMapStyle } from './model/waf-mapstyle.model';
import { WafNodeStyle } from './model/waf-nodestyle.model';
import { WafLinkStyle } from './model/waf-linkstyle.model';
import { WafRangeStyle } from './model/waf-rangestyle.model';
import { WafLabelStyle } from './model/waf-labelstyle.model';

import { NgModule, Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';

import * as Q from "@ext/qunee";

@Injectable()
export class WafQuneeConcreteTopoMap extends WafITopoMap {
  private graph;
  private overview;
  private prescale: number = -1;

  constructor() {
    super();
    console.log('WafQuneeConcreteTopoMap...................', Q);
  }

  getStaticStyle() {
    var style = new WafTopoStyle();
    style.linkStyle = new WafLinkStyle();
    style.rangeStyle = new WafRangeStyle();
    style.linkStyle.width = 2;
    style.linkStyle.shape = 0;
    style.rangeStyle.backgroundColor = '#d1d8e8';
    style.rangeStyle.showDepth = 9;
    return style;
    /*return {
      'map':{'physicaltopo': false, 'wheelZoom':1.15, 'minscale':0.2, 'middlescale':0.4, 'overview':true, 'enableDoubleClickToOverview':'true', 'id':'map','overviewId':'overview', 'backgroundImage':'', 'backgroundColor':'#E8CCFF', 'zoomable':true, 'dragable':true},
      'node':{'textPosition':'Middle_Center', 'textOffsetX':0, 'textOffsetY':3, 'fontSize': 10, 'fontFamily':'helvetica arial', 'fontColor':'#0044bb', 'size':{'w':30, 'h':30,'yw':30, 'yh':30}, 'alpha':'0.8',
        'borderRadius':5, 'borderWidth':0, 'borderColor':'34,100,20', 'borderPadding':{top:15, right:15, bottom:20, left:20}, 'dragable':true},
      'link':{'lineWidth':1, 'fontSize': 14, 'fontFamily':'微软雅黑', 'fontColor':'#2898E0', 'dashedPattern':0, 'bundleOffset':60, 'bundleGap':50, 'textOffsetX':0, 'textOffsetY':3, 'alpha':'0.7' },
      'range':{'textPosition':'Middle_Center', 'fontSize': 10, 'fontFamily':'微软雅黑', 'fontColor':'#008800', 'textOffsetX':0, 'textOffsetY':3, 'dragable':false, 'borderWidth':0, 'borderColor':'242, 209, 159', 'fillColor':'#d1d8e8', 'borderRadius':15, 'alpha':'0.5'},
      'label':{}
    }*/
  }

  getThirdParty() {
    return "qunee";
  }

  hasInitialized(): boolean {
    return null != this.graph ? true : false;
  }

  createMap(config: WafTopoStyle): Object {
    var me = this;
    var canvasId = config.mapStyle.mapId;
    var overviewId = config.mapStyle.overviewId;
    var toolbarId = config.mapStyle.toolbarId;
    var zoomable = config.mapStyle.zoomable;
    var dragable = config.mapStyle.draggable;
    var wheelZoom = config.mapStyle.wheelZoom;
    var middlescale = config.mapStyle.middleScale;
    var minscale = config.mapStyle.minScale;
    if (canvasId && null != canvasId) {
      var canvas = document.getElementById(canvasId + '-' + this.wafTopologyComponent.getId());
      var overviewContainer = document.getElementById(overviewId + '-' + this.wafTopologyComponent.getId());
      var toolbarContainer = document.getElementById(toolbarId + '-' + this.wafTopologyComponent.getId());
      this.graph = new Q.Graph(canvas);
      if (null != overviewContainer) {
        // 创建鸟瞰图
        this.overview = new Q.Overview(overviewContainer, this.graph);
      }

      this.graph.originAtCenter = false;
      this.graph.scaleStep = wheelZoom;
      this.graph.minScale = minscale;
      var background = config.mapStyle.background;
      var backgroundColor = config.mapStyle.backgroundColor;
      if (1 == background && null != backgroundColor && '' != backgroundColor) {
        this.graph.html.style.backgroundColor = backgroundColor;
      }

      // 设置鼠标缩放比例
      if (zoomable) {
        this.graph.enableWheelZoom = true;
      } else {
        this.graph.enableWheelZoom = false;
      }

      this.graph.onPropertyChange('scale', function (evt) {
        var scale = me.graph.scale;
        if (me.prescale == -1) {
          me.prescale = scale;
        }
        //console.log('scale = ', scale);
        if (scale < middlescale && me.prescale >= middlescale) {
          me.prescale = scale;
          me.wafTopologyComponent.onMapZoomable(false);
        } else if (scale > middlescale && me.prescale <= middlescale) {
          me.prescale = scale;
          me.wafTopologyComponent.onMapZoomable(true);
        }
      });

      // 控制拖动
      if (false == dragable) {
        Q.PanInteraction.prototype = {};
      }

      var enableDoubleClickToOverview = config.mapStyle.enableDoubleClickToOverview;
      if (enableDoubleClickToOverview) {
        this.graph.enableDoubleClickToOverview = true;
      } else {
        this.graph.enableDoubleClickToOverview = false;
      }

      /*      this.graph.onmousemove = function(evt) {
              var data = evt.getData();
              if (data && data.onmousemove) {
                data.onmousemove(evt);
              }
            }*/
      /*      this.graph.onmousedown = function(evt) {
              var data = evt.getData();
              if (data && data.onmousedown) {
                data.onmousedown(evt);
              }
            }*/
      /*      this.graph.ondrag = function(evt) {
              var data = evt.getData();
              if (data && data.ondrag) {
                data.ondrag(evt);
              }
            }*/
      /*      this.graph.onmouseup = function(evt) {
              var data = evt.getData();
              if (data && data.onmouseup) {
                data.onmouseup(evt);
              }
            }*/
      /*this.graph.onmouseover = function(evt) {
        var data = evt.getData();
        if (data && data.onmouseover) {
          data.onmouseover(evt);
        }
      }
      this.graph.onmouseout = function(evt) {
        var data = evt.getData();
        if (data && data.onmouseout) {
          data.onmouseout(evt);
        }
      }*/
      /*      this.graph.ondblclick = function(evt) {
              var data = evt.getData();
              if (data && data.ondblclick) {
                data.ondblclick(evt);
              }
            }*/
      this.graph.html.addEventListener('click', function (evt) {
        me.wafTopologyComponent.onMapClick(evt);
        var data = me.graph.getElementByMouseEvent(evt);
        if (data && data.onclick) {
          data.onclick(evt);
        }
      }, false);
      this.graph.html.addEventListener('dblclick', function (evt) {
        var data = me.graph.getElementByMouseEvent(evt);
        if (data && data.ondblclick) {
          data.ondblclick(evt);
        }
      }, false);
      /*this.graph.canvasPanel.addEventListener('mousedown', function(evt) {
        var data = me.graph.getElementByMouseEvent(evt);
        console.log(data);
        if (data && data.onmousedown) {
          data.onmousedown(evt);
        }
      }, false);
      this.graph.canvasPanel.addEventListener('mouseup', function(evt) {
        var data = me.graph.getElementByMouseEvent(evt);
        console.log(data);
        if (data && data.onmouseup) {
          data.onmouseup(evt);
        }
      }, false);*/
      this.graph.canvasPanel.addEventListener('mousemove', function (evt) {
        var data = me.graph.getElementByMouseEvent(evt);
        /*        var ui = me.graph.getUIByMouseEvent(evt);
                if (ui) {
                  console.log(ui.data);
                } else {
                  console.log(null);
                }*/
        if (data && data.onmousemove) {
          if (data.model && null != data.model) {
            if (data.model instanceof WafTNode) {
              data.onmousemove(evt);
            } else if (data.model instanceof WafTLink) {
              data.onmousemove(evt);
            } else if (data.model instanceof WafTRange) {
              data.onmousemove(evt);
            }
          }
        } else {
          me.wafTopologyComponent.onMapMove(0, 0);
        }
      }, false);
      this.graph.interactionDispatcher.addListener(function (evt) {
        if (evt.kind == Q.InteractionEvent.ELEMENT_MOVE_END) {
          // console.log('evt.datas = ', evt.datas);
          if (evt.datas && evt.datas != null && evt.datas.length > 0) {
            if (evt.datas[0] instanceof Q.Node) {
              var model = evt.datas[0].model;
              if (model instanceof WafTNode) {
                // console.log('Q.Node dragged.....');
                evt.datas[0].ondragend(evt);
              }
            }
          }
        } else if (evt.kind == Q.InteractionEvent.ELEMENT_MOVING) {
          // console.log('evt.datas = ', evt.datas);
          if (evt.datas && evt.datas != null && evt.datas.length > 0) {
            if (evt.datas[0] instanceof Q.Node) {
              var model = evt.datas[0].model;
              if (model instanceof WafTNode) {
                // console.log('Q.Node dragged.....');
                evt.datas[0].ondragging(evt);
              }
            }
          }
        }
      });
      Object.defineProperties(Q.Element.prototype, {
        visible: {
          get: function () {
            return this._visible != false;
          },
          set: function (v) {
            if (this.visible == v) {
              return;
            }
            this._visible = v;
            this.invalidateVisibility();
            this.invalidate();
          }
        }
      });
      /*Object.defineProperties(this.graph, {
        currentSubNetwork: {
          get: function(){
            return this.graphModel.currentSubNetwork;
          },
          set: function(v){
            var old = this.currentSubNetwork;
            if(old && old.enableGroupSubNetwork){
              old.enableSubNetwork = false;
            }
            if(v && v.enableGroupSubNetwork){
              v.enableSubNetwork = true;
            }
            this.graphModel.currentSubNetwork = v;
          }
        }
      })*/
      var superAction = Q.DoubleClickInteraction.prototype.ondblclick;
      var DoubleClickInteraction = Q.DoubleClickInteraction;
      DoubleClickInteraction.prototype.ondblclick = function (evt, graph) {
        var data = evt.getData();
        if (data instanceof Q.Group) {
          return;
        }
        superAction.apply(this, arguments);
      }

      var drawSuperAction = Q.NodeUI.prototype.draw;
      Q.NodeUI.prototype.draw = function (g, scale, selected, selectionStyles) {
        if (selected) {
          var bounds = this.bodyBounds.clone();
          bounds.x -= this.data.x;
          bounds.y -= this.data.y;
          bounds.grow(5);
          var r = Math.min(bounds.width, bounds.height) / 2;
          g.save();
          g.strokeStyle = '#188ffd';
          g.lineWidth = 1;
          g.beginPath();
          g.arc(bounds.cx, bounds.cy, r, 0, Math.PI * 2)
          g.stroke();
          g.restore();
        }
        return drawSuperAction.apply(this, arguments);
      }
      this.graph.styles = {};
      this.graph.styles[Q.Styles.IMAGE_PADDING] = new Q.Insets(4, 4, 0, 4);
      // 全局设置
      // this.graph.styles[Q.Styles.EDGE_BUNDLE_TYPE] = Q.Consts.EDGE_BUNDLE_TYPE_PARALLEL;
      this.setCurrentMode(0);
      return this.graph;
    } else {
      return null;
    }
  }

  addMenus() {
    this.graph.popupmenu = new Q.PopupMenu();
    this.graph.popupmenu.getMenuItems = function (graph, data, evt) {
      var menuItems = [];
      menuItems.push({
        name: '返回上层子网', action: function () {

        }
      });
      menuItems.push({
        name: '进入子网', action: function () {

        }
      });
      return menuItems;
    }
  }

  createNode(node: WafTNode, config: WafTopoStyle): Object {
    var me = this;
    var nodeCoordinate = node.coordinate;
    var x = Number(eval('nodeCoordinate.x'));
    var y = Number(eval('nodeCoordinate.y'));
    var nodeWithPNG = this.graph.createNode(node.showname, x, y);
    if (node.showimgsrc && null != node.showimgsrc && node.imgstyle && null != node.imgstyle) {
      var w = Number(eval('node.imgstyle.w'));
      var h = Number(eval('node.imgstyle.h'));
      nodeWithPNG.image = node.showimgsrc;
      nodeWithPNG.size = { width: w, height: h };
    }
    // 设置边框
    if (null != node.style && null != node.style.borderColor) {
      nodeWithPNG.setStyle(Q.Styles.IMAGE_BORDER, 1);
      nodeWithPNG.setStyle(Q.Styles.IMAGE_BORDER_STYLE, node.style.borderColor);
      nodeWithPNG.setStyle(Q.Styles.IMAGE_PADDING, 5);
      nodeWithPNG.setStyle(Q.Styles.IMAGE_BORDER_RADIUS, 0)
    }
    // 设置小图标
    if (null != node.iconChildList) {
      for (var i = 0; i < node.iconChildList.length; i++) {
        var icon = new Q.ImageUI(node.iconChildList[i].showimgsrc);
        icon.size = {width: 12, height: 12};
        if (null != node.iconChildList[i].params) {
          var position = node.iconChildList[i].params['position'];
          if (position != null) {
            if (0 == position) {
              icon.position = Q.Position.RIGHT_TOP;
              icon.anchorPosition = Q.Position.RIGHT_TOP;
              icon.offsetX = 15;
              icon.offsetY = 2;
            } else if (0.5 == position) {
              icon.position = Q.Position.RIGHT_MIDDLE;
              icon.anchorPosition = Q.Position.RIGHT_MIDDLE;
              icon.offsetX = 15;
            } else if (1 == position) {
              icon.position = Q.Position.RIGHT_BOTTOM;
              icon.anchorPosition = Q.Position.RIGHT_BOTTOM;
              icon.offsetX = 15;
            }
          }
        }
        icon.showPointer = false;
        // icon.offsetY = y;
        nodeWithPNG.addUI(icon);
      }
    }
    var nodeStyle = config.nodeStyle;
    if (nodeStyle && null != nodeStyle) {
      var Insets = Q.Insets;
      // 设置透明度
      nodeWithPNG.setStyle(Q.Styles.ALPHA, 0.8);
      nodeWithPNG.setStyle(Q.Styles.LABEL_FONT_SIZE, 10);
      nodeWithPNG.setStyle(Q.Styles.LABEL_FONT_FAMILY, 'helvetica arial');
      nodeWithPNG.setStyle(Q.Styles.LABEL_COLOR, '#0044bb');
      nodeWithPNG.setStyle(Q.Styles.LABEL_OFFSET_X, 3);
      nodeWithPNG.setStyle(Q.Styles.LABEL_OFFSET_Y, 10);
      nodeWithPNG.setStyle(Q.Styles.BORDER, 0);
      nodeWithPNG.setStyle(Q.Styles.BORDER_COLOR, 'rgb(34,100,20)');
      nodeWithPNG.setStyle(Q.Styles.BORDER_RADIUS, { x: 5, y: 5 });
      nodeWithPNG.setStyle(Q.Styles.PADDING, new Insets(15, 15, 20, 20));
      nodeWithPNG.movable = nodeStyle.draggable;
    }

    nodeWithPNG.ondragend = function (evt) {
      var data = evt.datas[0];
      // console.log('ondrag data = ', data);
      me.wafTopologyComponent.onNodeMouseDragEnd(node);
    }
    nodeWithPNG.ondragging = function (evt) {
      var data = evt.datas[0];
      // console.log('ondrag data = ', data);
      me.wafTopologyComponent.onNodeMouseDragging(data);
    }
    nodeWithPNG.onclick = function (evt) {
      var data = evt.getData();
      // console.log('onclick data = ', data);
      me.wafTopologyComponent.onNodeClick(data, evt.offsetX, evt.offsetY);
    }
    nodeWithPNG.onmousedown = function (evt) {
      var data = evt.getData();
      // console.log('onmousedown data = ', data);
      me.wafTopologyComponent.onNodeMouseDown(data);
    }
    nodeWithPNG.onmouseup = function (evt) {
      var data = evt.getData();
      // console.log('onmouseup data = ', data);
      me.wafTopologyComponent.onNodeMouseUp(data, evt.offsetX, evt.offsetY);
    }
    nodeWithPNG.onmouseover = function (evt) {
      var data = evt.getData();
      // console.log('onmouseover data = ', data);
      me.wafTopologyComponent.onNodeMouseOver(data);
    }
    nodeWithPNG.onmouseout = function (evt) {
      var data = evt.getData();
      // console.log('onmouseout data = ', data);
      me.wafTopologyComponent.onNodeMouseOut(data);
    }
    nodeWithPNG.onmousemove = function (evt) {
      var data = evt.getData();
      // console.log('onmousemove data = ', data);
      me.wafTopologyComponent.onNodeMouseMove(data, evt.offsetX, evt.offsetY);
    }
    nodeWithPNG.ondblclick = function (event) {
      var data = event.getData();
      // console.log('ondblclick data = ', data);
      me.wafTopologyComponent.onNodeDblClick(data);
    };
    return nodeWithPNG;
  }

  showShadow(node: WafTNode, flag: boolean) {
  }

  createLink(link: WafTLink, config: WafTopoStyle): Object {
    var me = this;
    var leftNode = link.leftnode.realnode;
    var rightNode = link.rightnode.realnode;
    var edge = this.graph.createEdge(link.showname, leftNode, rightNode);
    edge.validateEdgeBundle = function () {
      var edgeBundle = this.getEdgeBundle(true);
      if (!edgeBundle || edgeBundle.agentEdge != this) {
        if ('oldName' in this) {
          this.name = this.oldName;
          delete this.oldName;
        }
        return;
      }
      this.oldName = this.name;
      this.name = null;
    }
    edge.setStyle(Q.Styles.EDGE_COLOR, 'rgb(' + link.strokecolor + ')');
    edge.setStyle(Q.Styles.EDGE_BUNDLE_TYPE, Q.Consts.EDGE_BUNDLE_TYPE_PARALLEL);
    if (link.style && null != link.style) {
      // 线宽
      var linkStyle = eval('link.style');
      edge.setStyle(Q.Styles.EDGE_WIDTH, linkStyle.lineWidth);
      edge.setStyle(Q.Styles.EDGE_BUNDLE_GAP, linkStyle.bundleGap);
      edge.setStyle(Q.Styles.LABEL_FONT_SIZE, linkStyle.fontSize);
      edge.setStyle(Q.Styles.LABEL_FONT_FAMILY, linkStyle.fontFamily);
      edge.setStyle(Q.Styles.LABEL_COLOR, linkStyle.fontColor);
      edge.setStyle(Q.Styles.LABEL_OFFSET_X, linkStyle.textOffsetX);
      edge.setStyle(Q.Styles.LABEL_OFFSET_Y, linkStyle.textOffsetY);
    }
    edge.setStyle(Q.Styles.ARROW_TO, false);
    edge.edgeType = null || Q.Consts.EDGE_TYPE_DEFAULT;
    edge.setStyle(Q.Styles.EDGE_BUNDLE_TYPE, Q.Consts.EDGE_BUNDLE_TYPE_PARALLEL);
    edge.onclick = function (evt) {
      var data = evt.getData();
      console.log('onclick data = ', data);
      me.wafTopologyComponent.onLinkClick(data, evt.offsetX, evt.offsetY);
    }
    edge.onmousemove = function (evt) {
      var data = evt.getData();
      // console.log('onclick data = ', data);
      me.wafTopologyComponent.onLinkMouseMove(data, evt.offsetX, evt.offsetY);
    }
    /*    edge.onmouseover = function(evt) {
          var data = evt.getData();
          console.log('onmouseover data = ', data);
          me.wafTopologyComponent.onLinkMouseOver(data, evt.offsetX, evt.offsetY);
        }
        edge.onmouseout = function(evt) {
          var data = evt.getData();
          console.log('onmouseout data = ', data);
          me.wafTopologyComponent.onLinkMouseOut(data);
        }*/
    return edge;
  }

  getDistance(type: number, p1, p2) {
    return -1;
  }

  setPosition(node: Object, x: number, y: number) {
    if (null != node && node instanceof Q.Node) {
      eval('node.x = x;');
      eval('node.y = y;');
    }
  }

  getUIBounds(obj: Object): Object {
    if (null != obj) {
      return this.graph.getUIBounds(obj);
    }
    return null;
  }

  createRange(range: WafTRange, config: WafTopoStyle): Object {
    var me = this;
    var group = this.graph.createGroup(range.showname);
    group.enableGroupSubNetwork = true;
    group.expanded = true;
    var Inset = Q.Insets;
    // group.padding = new Inset(40, 10, 10, 10);
    //group.groupImage = eval('Q.Graphs.cloud');
    group.padding = 30;
    //group.setStyle(eval('Q.Styles.RENDER_COLOR'), "#2898E0");
    var rangeStyle = config.rangeStyle;
    if (rangeStyle && null != rangeStyle) {
      group.setStyle(Q.Styles.ALPHA, 1);
      group.setStyle(Q.Styles.LABEL_FONT_SIZE, 10);
      group.setStyle(Q.Styles.LABEL_FONT_FAMILY, '微软雅黑');
      group.setStyle(Q.Styles.LABEL_COLOR, '#008800');
      group.setStyle(Q.Styles.LABEL_OFFSET_X, 3);
      group.setStyle(Q.Styles.LABEL_OFFSET_Y, 3);
      // group.setStyle(Q.Styles.LABEL_PADDING, 2);

      group.setStyle(Q.Styles.LABEL_POSITION, Q.Position.LEFT_TOP);
      group.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.LEFT_TOP);

      group.setStyle(Q.Styles.BORDER, 1);
      // group.setStyle(Q.Styles.GROUP_STROKE, 0);
      group.setStyle(Q.Styles.BORDER_COLOR, 'rgb(10, 209, 159)');
      group.setStyle(Q.Styles.BORDER_RADIUS, { x: 15, y: 15 });
      group.setStyle(Q.Styles.GROUP_BACKGROUND_COLOR, rangeStyle.backgroundColor);
      group.movable = rangeStyle.draggable;
    }
    // group.groupType = Q.Consts.GROUP_TYPE_ELLIPSE;
    group.onmousemove = function (event) {
      var data = event.getData();
      me.wafTopologyComponent.onRangeMouseMove(data);
    };
    group.onmousedown = function (event) {
      var data = event.getData();
      me.wafTopologyComponent.onRangeMouseDown(data);
    };
    group.onmouseup = function (event) {
      var data = event.getData();
      me.wafTopologyComponent.onRangeMouseUp(data);
    };
    group.onmouseover = function (event) {
    };
    group.onmouseout = function (event) {
      var data = event.getData();
      me.wafTopologyComponent.onRangeMouseOut(data);
    };
    group.ondblclick = function (event) {
      var data = event.getData();
      me.wafTopologyComponent.onRangeDbClick(data);
    };
    return group;
  }

  moveElements(obj: Object, dx: number, dy: number) {
    if (obj != null) {
      this.graph.moveElements([obj], dx, dy);
    }
  }

  addChild(group: Object, node: Object) {
    var me = this;
    if (group instanceof Q.Group && (node instanceof Q.Node || node instanceof Q.Group)) {
      eval('group.addChild(node);');
    }
  }

  createLabel(node: WafTLabel): Object {
    return null;
  }

  addOverLay(overlay: Object): void {
  }

  panTo(type: number, config: Object): void {
    if (1 == type) {
      this.graph.centerTo(eval('config.x'), eval('config.y'));
    }
  }

  centerAndZoom(node: WafTNode): void {
    var me = this;
    this.graph.zoomToOverview(true, 1);
    /*    this.graph.callLater(function() {
          me.graph.scale *= 10;
        });*/
    console.log('QuneeConcreteTopoMap...........centerAndZoom......');
  }

  zoomIn(): void {
    this.graph.zoomOut();
  }

  zoomOut(): void {
    this.graph.zoomIn();
  }
  getDefaultZoom(): number {
    return 0;
  }
  getMinZoom(): number {
    return 0;
  }
  getMaxZoom(): number {
    return 0;
  }
  setZoom(zoomlevel: number): void {
  }
  showOverLay(overlay: Object): void {
    if (null != overlay) {
      eval('overlay.visible = true');
    }
  }
  hideOverLay(overlay: Object): void {
    if (null != overlay) {
      eval('overlay.visible = false;');
    }
  }
  showOverview() {
    if (null != this.overview) {
      this.overview.setVisible(true);
    }
  }
  hideOverview() {
    if (null != this.overview) {
      this.overview.setVisible(false);
    }
  }
  removeOverLay(overlay: Object): void {
    if (this.hasInitialized()) {
      if (null != overlay) {
        this.graph.removeElement(overlay);
      }
    }
  }
  updateNode(tnode: WafTNode, opType: number, params:any): any {
    // 逻辑域展开，收拢
    if (0 == opType) {
      if (tnode.realnode) {
        //var Node = eval('JTopo.Node');
        eval('tnode.realnode.image = tnode.showimgsrc;');
      }
    } else if (1 == opType) {
      // 显示ip/名称切换。
      if (tnode.realnode != null) {
        tnode.realnode.name = tnode.showname;
      }
    } else if (2 == opType) {
      if (tnode.realnode != null) {
        tnode.realnode.x = tnode.coordinate.x;
        tnode.realnode.y = tnode.coordinate.y;
      }
    } else if (3 == opType) {
      // 动态添加小图标
      var iconModel = params['icon'];
      var icon = new Q.ImageUI(iconModel.showimgsrc);
      icon.size = {width: 12, height: 12};
      if (null != iconModel.params) {
        var position = iconModel.params['position'];
        if (position != null) {
          if (0 == position) {
            icon.position = Q.Position.RIGHT_TOP;
            icon.anchorPosition = Q.Position.RIGHT_TOP;
            icon.offsetX = 15;
            icon.offsetY = 2;
          } else if (0.5 == position) {
            icon.position = Q.Position.RIGHT_MIDDLE;
            icon.anchorPosition = Q.Position.RIGHT_MIDDLE;
            icon.offsetX = 15;
          } else if (1 == position) {
            icon.position = Q.Position.RIGHT_BOTTOM;
            icon.anchorPosition = Q.Position.RIGHT_BOTTOM;
            icon.offsetX = 15;
          }
        }
      }
      icon.showPointer = false;
      // icon.offsetY = y;
      if (null != tnode.realnode) {
        tnode.realnode.addUI(icon);
      }
      return icon;
    } else if (4 == opType) {
      var realnode = tnode.realnode;
      var nodeicon = params['model'];
      if (null != realnode && null != nodeicon && null != nodeicon.realnodeicon) {
        console.log('WafQuneeConcreteTopoMap执行删除：', nodeicon);
        realnode.removeUI(nodeicon.realnodeicon);
      }
    } else if (5 == opType) {
      // 更新主图标
      if (tnode.realnode) {
        eval('tnode.realnode.image = tnode.showimgsrc;');
      }
      // 设置边框
      if (null != tnode.style && null != tnode.style.borderColor && null != tnode.realnode) {
        tnode.realnode.setStyle(Q.Styles.IMAGE_BORDER, 1);
        tnode.realnode.setStyle(Q.Styles.IMAGE_BORDER_STYLE, tnode.style.borderColor);
        tnode.realnode.setStyle(Q.Styles.IMAGE_PADDING, 5);
        tnode.realnode.setStyle(Q.Styles.IMAGE_BORDER_RADIUS, 0);
      } else if (null == tnode.style || null == tnode.style.borderColor && null != tnode.realnode) {
        tnode.realnode.setStyle(Q.Styles.IMAGE_BORDER, 0);
      }
      // 更新小图标（可能添加，可能修改，可能删除）先删除所有，然后添加（除向上连纤）
      var iconChildList = tnode.iconChildList;
      if (null != iconChildList) {
        for (var i = 0; i < iconChildList.length; i++) {
          if (iconChildList[i].deleted == true) {
            if (null != tnode.realnode && null != iconChildList[i].realnodeicon) {
              tnode.realnode.removeUI(iconChildList[i].realnodeicon);
              tnode.iconChildList.splice(i--, 1);
              continue;
            }
          }
          if (iconChildList[i].isPainted()) {
            if (null != tnode.realnode && null != iconChildList[i].realnodeicon) {
              tnode.realnode.removeUI(iconChildList[i].realnodeicon);
              var icon = new Q.ImageUI(iconChildList[i].showimgsrc);
              icon.size = {width: 12, height: 12};
              if (null != iconChildList[i].params) {
                var position = iconChildList[i].params['position'];
                if (position != null) {
                  if (0 == position) {
                    icon.position = Q.Position.RIGHT_TOP;
                    icon.anchorPosition = Q.Position.RIGHT_TOP;
                    icon.offsetX = 15;
                    icon.offsetY = 2;
                  } else if (0.5 == position) {
                    icon.position = Q.Position.RIGHT_MIDDLE;
                    icon.anchorPosition = Q.Position.RIGHT_MIDDLE;
                    icon.offsetX = 15;
                  } else if (1 == position) {
                    icon.position = Q.Position.RIGHT_BOTTOM;
                    icon.anchorPosition = Q.Position.RIGHT_BOTTOM;
                    icon.offsetX = 15;
                  }
                }
              }
              icon.showPointer = false;
              // icon.offsetY = y;
              tnode.realnode.addUI(icon);
            }
          } else {
            var icon = new Q.ImageUI(iconChildList[i].showimgsrc);
            icon.size = {width: 12, height: 12};
            if (null != iconChildList[i].params) {
              var position = iconChildList[i].params['position'];
              if (position != null) {
                if (0 == position) {
                  icon.position = Q.Position.RIGHT_TOP;
                  icon.anchorPosition = Q.Position.RIGHT_TOP;
                  icon.offsetX = 15;
                  icon.offsetY = 2;
                } else if (0.5 == position) {
                  icon.position = Q.Position.RIGHT_MIDDLE;
                  icon.anchorPosition = Q.Position.RIGHT_MIDDLE;
                  icon.offsetX = 15;
                }
              }
            }
            icon.showPointer = false;
            // icon.offsetY = y;
            tnode.realnode.addUI(icon);
          }
        }
      }
    }
  }

  updateLink(tlink: WafTLink, opType: number): void {
    // 光纤选中，光纤状态更新
    if (0 == opType) {
      if (tlink.reallink) {
        var edgeColor = Q.Styles.EDGE_COLOR;
        var realcolor = "rgb(" + tlink.strokecolor + ")";
        eval('tlink.reallink.setStyle(edgeColor, realcolor);');
      }
    } else if (1 == opType) {
      // 光纤名称隐藏显示
      if (tlink.reallink) {
        eval('tlink.reallink.name = tlink.showname;');
      }
    }
  }

  updateRange(range: WafTRange): void {
    var me = this;
    var logicNode = range.tnode;
    var defaultContainer = range.realrange;
    var fun = eval('defaultContainer.children.toDatas().forEach(function(child) {child.parent=null;})');
    if (null != logicNode) {
      eval('defaultContainer.addChild(logicNode.realnode);');
      var nodes = logicNode.childList;
      if (nodes && null != nodes) {
        for (var i = 0; i < nodes.length; i++) {
          eval('defaultContainer.addChild(nodes[i].realnode);');
        }
      }
    }
  }
  updateLabel(tlabel: WafTLabel): void { }

  release(node: WafTNode): void {
    if (this.hasInitialized()) {
      this.graph.clear();
    }
  }

  getNodeLocation(node: Object): Object {
    if (node && null != node) {
      return { x: eval('node.x'), y: eval('node.y') };
    }
    return null;
  }

  getAddress(lng, lat, callback) {
    callback('');
  }
  /*
    createRect() {
      return new Q.Rect();
    }

    addToRect(rect:Object, x:number, y:number) {
      if (null != rect && rect instanceof Q.Rect) {
        eval('rect.add(x, y);');
      }
    }*/

  callLater(opType: number, params: any) {
    var me = this;
    this.graph.callLater(function () {
      if (1 == opType) {
        var tnode = params['model'];
        // 在展开逻辑域延迟绘制的时候，需要动态移动域节点。
        var group = tnode.trange.realrange;
        var node = tnode.realnode;
        if (null != group && null != node) {
          let oldGroupBound = me.graph.getUIBounds(group);
          let newGroupBound = me.getNodeLocation(node);
          me.moveElements(group, newGroupBound['x'] - oldGroupBound['x'], newGroupBound['y'] - oldGroupBound['y']);
        }
      }
    });
  }

  setCurrentMode(mode: number) {
    if (1 == mode) {
      this.graph.interactionMode = Q.Consts.INTERACTION_MODE_DEFAULT;
    } else if (2 == mode) {
      this.graph.interactionMode = Q.Consts.INTERACTION_MODE_SELECTION;
    } else if (3 == mode) {
      this.graph.interactionMode = Q.Consts.INTERACTION_MODE_VIEW;
    }
  }

  setSection(selectedNodes:Array<WafTNode>) {
    var nodes = [];
    if (null != selectedNodes) {
      for (var i = 0; i < selectedNodes.length; i++) {
        if (null != selectedNodes[i].realnode) {
          nodes.push(selectedNodes[i].realnode);
        }
      }
    }
    this.graph.setSelection(nodes);
  }

  destroy() {
    this.graph.destroy();
    this.graph = null;
  }
}
