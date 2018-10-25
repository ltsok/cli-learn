import {WafTNode} from '../model/waf-tnode.model';
import {WafTLink} from '../model/waf-tlink.model';
import {WafTLabel} from '../model/waf-tlabel.model';
import {WafTRange} from '../model/waf-trange.model';
import {WafTopoStyle} from '../model/waf-style.model';
import {Injectable, Inject} from '@angular/core';
import {WafITopoMap} from '../interface/waf-itopomap.interface';

class LatLngModel {
  public latitude;
  public longitude;

  constructor(lat, lng) {
    this.latitude = lat;
    this.longitude = lng;
  }
}

@Injectable()
export class WafTopologyService {
  // 地球半径
  earchRadius: number = 6378137;
  // 多光纤最多数量
  maxMuitiLinkNum: number = 5;
  private iTopoMap: WafITopoMap;
  private topoType: string

  constructor() {
  }

  contains(array, needle: string) {
    for (var i in array) {
      if (array[i] == needle) return true;
    }
    return false;
  }

  setTopoType(pTopoType: string) {
    this.topoType = pTopoType;
  }

  setITopoMap(iTopoMap: WafITopoMap) {
    this.iTopoMap = iTopoMap;
  }

  sortFromMinToMax(array) {
    if (null != array) {
      for (var i = array.length - 1; i >= 0; i--) {
        for (var j = 0; j < i; j++) {
          if (Number(array[j]) > Number(array[j + 1])) {
            var t = array[j];
            array[j] = array[j + 1];
            array[j + 1] = t;
          }
        }
      }
    }
    return array;
  }

  getRad(d) {
    var PI = Math.PI;
    return d * PI / 180.0;
  }

  // 根据一组坐标点计算圆心
  calcuteCircleCenterLocation(latLngList) {
    var me = this;
    var LatLng = LatLngModel;
    if (null != latLngList && latLngList.length > 0) {
      var objects = [];
      objects.length = 2;
      var array = [];
      array.length = latLngList.length;
      for (var i = 0; i < latLngList.length; i++) {
        var latLng = latLngList[i];
        array[i] = latLng;
      }
      me.sortFromMinToMaxByLat(array);
      var minlat = Number(array[0].latitude);
      var maxlat = Number(array[array.length - 1].latitude);
      me.sortFromMinToMaxByLng(array);

      var minlng = Number(array[0].longitude);
      var maxlng = Number(array[array.length - 1].longitude);

      var latLng: any = new LatLng((minlat + maxlat) / 2, (minlng + maxlng) / 2);
      objects[0] = latLng;
      /*var radius = [];
      radius.length = latLngList.length;
      for (var i = 0; i < latLngList.length; i++) {
        radius[i] = this.iTopoMap.getDistance(2, latLng, latLngList[i]);
      }
      me.sortFromMinToMax(radius);
      objects[1] = radius[radius.length - 1];*/
      var m1 = new LatLng(minlat, (minlng + maxlng) / 2);
      var m2 = new LatLng((minlat + maxlat) / 2, minlng);
      /*      var r1 = this.iTopoMap.getDistance(2, latLng, m1);
            var r2 = this.iTopoMap.getDistance(2, latLng, m2);*/
      var r1 = this.getGreatCircleDistance((minlat + maxlat) / 2, (minlng + maxlng) / 2, minlat, (minlng + maxlng) / 2);
      var r2 = this.getGreatCircleDistance((minlat + maxlat) / 2, (minlng + maxlng) / 2, (minlat + maxlat) / 2, minlng);
      var r = Math.sqrt(r1 * r1 + r2 * r2);
      objects[1] = r;
      return objects;
    }
    return null;
  }

  /**
   * caculate the great circle distance
   * @param {Object} lat1
   * @param {Object} lng1
   * @param {Object} lat2
   * @param {Object} lng2
   */
  getGreatCircleDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = this.getRad(lat1);
    var radLat2 = this.getRad(lat2);

    var a = radLat1 - radLat2;
    var b = this.getRad(lng1) - this.getRad(lng2);

    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * this.earchRadius;
    s = Math.round(s * 10000) / 10000.0;

    return s;
  }

  /**
   * approx distance between two points on earth ellipsoid
   * @param {Object} lat1
   * @param {Object} lng1
   * @param {Object} lat2
   * @param {Object} lng2
   */
  getFlatternDistance(lat1, lng1, lat2, lng2) {
    var f = this.getRad((lat1 + lat2) / 2);
    var g = this.getRad((lat1 - lat2) / 2);
    var l = this.getRad((lng1 - lng2) / 2);

    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);

    var s, c, w, r, d, h1, h2;
    var a = this.earchRadius;
    var fl = 1 / 298.257;

    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;

    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;

    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;

    return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
  }

  sortFromMinToMaxByLat(array) {
    if (null != array) {
      for (var i = array.length - 1; i >= 0; i--) {
        for (var j = 0; j < i; j++) {
          var latLng = array[j];
          var latLng1 = array[j + 1];
          if (Number(latLng.latitude) > Number(latLng1.latitude)) {
            var t = array[j];
            array[j] = array[j + 1];
            array[j + 1] = t;
          }
        }
      }
    }
    return array;
  }

  sortFromMinToMaxByLng(array) {
    if (null != array) {
      for (var i = array.length - 1; i >= 0; i--) {
        for (var j = 0; j < i; j++) {
          var latLng = array[j];
          var latLng1 = array[j + 1];
          if (Number(latLng.longitude) > Number(latLng1.longitude)) {
            var t = array[j];
            array[j] = array[j + 1];
            array[j + 1] = t;
          }
        }
      }
    }
    return array;
  }

  convertToTopoNode(datasource: any, config: any, selectednode: any): WafTNode {
    return datasource;
  }

  /*

    convertToTopoNode(datasource:any, config:any, selectednode:any):WafTNode {
      var me = this;
      //me.startime = new Date().getTime(); // 开始时间
      var tnode:WafTNode = null;
      var linkHasLabel = config.link.hasLabel;
      var multiLink = config.link.multiLink;
      var latlngList = [];
      if (null != datasource) {
        var shownodenameflag = config.shownodename;
        var showlinenameflag = config.showlinename;
        var nodesize = config.node.size;
        var datasource = datasource[0];
        var ncds = datasource.ncds;
        // 判断是否DC
        if (ncds && ncds.length == 1) {
          tnode = new WafTNode();
          tnode.style = config.node;
          tnode.id = ncds[0].id;
          tnode.name = ncds[0].name;
          if (shownodenameflag) {
            tnode.showname = ncds[0].name;
          } else {
            tnode.showname = '';
          }
          tnode.parent = null;
          tnode.level = 1;
          tnode.type = 0;
          // 是否默认展开读取配置
          tnode.expanded = config.expanded;
          if (tnode.expanded) {
            tnode.imgsrc = './resources/images/logicexpand.png';
            tnode.showimgsrc = './resources/images/logicexpand.png';
            tnode.imgstyle = {w: nodesize.yw, h: nodesize.yh};
          } else {
            tnode.imgsrc = './resources/images/logiccollapse.png';
            tnode.showimgsrc = './resources/images/logiccollapse.png';
            tnode.imgstyle = {w: nodesize.yw, h: nodesize.yh};
          }
          tnode.visible = true;
          tnode.painted = false;
          tnode.childList = [];
          // 填充网元
          var nodes = datasource.nodes;
          if (nodes && null != nodes) {
            var minX:number = 0;
            var maxX:number = 0;
            var minY:number = 0;
            var maxY:number = 0;
            for (var i = 0; i < nodes.length; i++) {
              var childTnode = new WafTNode();
              childTnode.style = config.node;
              tnode.childList.push(childTnode);
              childTnode.id = nodes[i].id;
              childTnode.type = 1;
              childTnode.name = nodes[i].name;
              childTnode.ip = nodes[i].ip;
              if (shownodenameflag) {
                childTnode.showname = nodes[i].name;
              } else {
                childTnode.showname = '';
              }
              childTnode.status = nodes[i].status;
              childTnode.centerLatLng = {latitude: nodes[i].latitude, longitude: nodes[i].longitude};
              // 放入临时数组，用来计算圆心。
              latlngList.push(childTnode.centerLatLng);
              childTnode.coordinate = {x: nodes[i].xCoordinate, y: nodes[i].yCoordinate};
              //childTnode.coordinate = {x: 20 * nodes[i].xCoordinate, y: 20 * nodes[i].yCoordinate};
              // 计算逻辑坐标
              if (Number(nodes[i].xCoordinate) > maxX) {
                maxX = Number(nodes[i].xCoordinate);
              }
              if (Number(nodes[i].xCoordinate) < minX) {
                minX = Number(nodes[i].xCoordinate);
              }
              if (Number(nodes[i].yCoordinate) > maxY) {
                maxY = Number(nodes[i].yCoordinate);
              }
              if (Number(nodes[i].yCoordinate) < minY) {
                minY = Number(nodes[i].yCoordinate);
              }

              childTnode.level = 2;
              childTnode.links = [];
              if (tnode.expanded) {
                childTnode.visible = true;
              } else {
                childTnode.visible = false;
              }
              childTnode.imgsrc = this.getTopoIcon(childTnode.name, 0, config);
              childTnode.showimgsrc = this.getTopoIcon(childTnode.name, 0, config);
              if (childTnode.status == 0) {
                childTnode.imgsrc = this.getTopoIcon(childTnode.name, 0, config);
                childTnode.showimgsrc = this.getTopoIcon(childTnode.name, 0, config);
              } else if (childTnode.status == 1) {
                childTnode.imgsrc = this.getTopoIcon(childTnode.name, 1, config);
                childTnode.showimgsrc = this.getTopoIcon(childTnode.name, 1, config);
              } else if (childTnode.status == 2) {
                childTnode.imgsrc = this.getTopoIcon(childTnode.name, 2, config);
                childTnode.showimgsrc = this.getTopoIcon(childTnode.name, 2, config);
              }
              if (selectednode != null && selectednode.id == childTnode.id) {
                var physicaltopo = config.map.physicaltopo;
                if (!physicaltopo) {
                  childTnode.showimgsrc = './resources/images/choosednelogo.png';
                } else {
                  childTnode.showimgsrc = './resources/images/topology/choosednelogo.png';
                }
              }
              childTnode.imgstyle = {w: nodesize.w, h: nodesize.h};

              childTnode.painted = false;
              childTnode.parent = tnode;
            }
            tnode.coordinate = {x: (minX + maxX) / 2, y: (minY + maxY) / 2};
          }

          var links = datasource.links;
          // link设置。
          if (links && null != links) {
            for (var i = 0; i < links.length; i++) {
              var link = links[i];
              var leftNodeId = link.leftNodeId;
              var rightNodeId = link.rightNodeId;
              var childTLink = new WafTLink();

              childTLink.style = config.link;
              childTLink.id = link.id;
              childTLink.name = link.name;
              childTLink.status = link.status;
              childTLink.type = 1;
              childTLink.leftnode = tnode.findTNodeById(leftNodeId);
              childTLink.rightnode = tnode.findTNodeById(rightNodeId);
              if (false == multiLink) {
                // 遍历看下childTLink.leftnode.links中之前是否已存在了该条光纤。
                var occurtime = 0;
                for (var k = 0; k < childTLink.leftnode.links.length; k++) {
                  var lnode = childTLink.leftnode.links[k].leftnode;
                  var rnode = childTLink.leftnode.links[k].rightnode;
                  if ((lnode == childTLink.leftnode && rnode == childTLink.rightnode)
                    || (lnode == childTLink.rightnode && rnode == childTLink.leftnode)) {
                    occurtime++;
                  }
                }
                childTLink.curveLatLng = null;
                if (occurtime == 0) {
                  childTLink.leftnode.links.push(childTLink);
                  childTLink.rightnode.links.push(childTLink);
                } else {
                  childTLink.curveLatLng = {latitude:null, longitude:null};
                  var leftLat = Number(childTLink.leftnode.centerLatLng.latitude);
                  var leftLng = Number(childTLink.leftnode.centerLatLng.longitude);
                  var rightLat = Number(childTLink.rightnode.centerLatLng.latitude);
                  var rightLng = Number(childTLink.rightnode.centerLatLng.longitude);
                  var latGap = leftLat >= rightLat ? (leftLat - rightLat) : (rightLat - leftLat);
                  var lngGap = leftLng >= rightLng ? (leftLng - rightLng) : (rightLng - leftLng);
                  if (0 == latGap) {
                    childTLink.curveLatLng = {latitude:leftLat, longitude:(leftLng + rightLng) / 2};
                  } else if (latGap <= lngGap) {
                    childTLink.curveLatLng = {latitude:(leftLat + rightLat) / 2, longitude:(leftLng + rightLng) / 2 + 0.5 * lngGap * occurtime / this.maxMuitiLinkNum};
                  } else {
                    childTLink.curveLatLng = {latitude:(leftLat + rightLat) / 2 + 0.5 * latGap * occurtime / this.maxMuitiLinkNum, longitude:(leftLng + rightLng) / 2};
                  }
                  if (0 == lngGap) {
                    childTLink.curveLatLng = {latitude:(leftLat + rightLat) / 2, longitude:leftLng};
                  } else if (latGap >= lngGap) {
                    childTLink.curveLatLng = {latitude:(leftLat + rightLat) / 2 + 0.5 * latGap * occurtime/ this.maxMuitiLinkNum, longitude:(leftLng + rightLng) / 2};
                  } else {
                    childTLink.curveLatLng = {latitude:(leftLat + rightLat) / 2, longitude:(leftLng + rightLng) / 2 + 0.5 * lngGap * occurtime / this.maxMuitiLinkNum};
                  }
                  childTLink.leftnode.links.push(childTLink);
                  childTLink.rightnode.links.push(childTLink);
                }
              } else {
                childTLink.leftnode.links.push(childTLink);
                childTLink.rightnode.links.push(childTLink);
              }
              if (tnode.expanded) {
                childTLink.visible = true;
              } else {
                childTLink.visible = false;
              }
              if (0 == childTLink.status) {
                childTLink.strokecolor = "58,131,165";
              } else if (1 == childTLink.status) {
                childTLink.strokecolor = "220,20,60";
              } else if (2 == childTLink.status) {
                childTLink.strokecolor = "220,20,60";
              }
              childTLink.painted = false;

              // 设置端口
              var leftChildTPort = new WafTPort();
              leftChildTPort.id = link.leftLtpId;
              var rightChildTPort = new WafTPort();
              rightChildTPort.id = link.rightLtpId;

              childTLink.leftport = leftChildTPort;
              childTLink.rightport = rightChildTPort;

              // 判断是否需要设置linklabel
              if (false == linkHasLabel) {
                var linkLabel = new WafTLabel();
                linkLabel.style = config.label;
                linkLabel.name = childTLink.name;
                linkLabel.showname = childTLink.name;
                linkLabel.centerLatLng = {latitude: null, longitude: null};
                if (null == childTLink.curveLatLng) {
                  var leftnodecoordinate = childTLink.leftnode.coordinate;
                  var rightnodecoordinate = childTLink.rightnode.coordinate;
                  var leftnodecenterLatLng = childTLink.leftnode.centerLatLng;
                  var rightnodecenterLatLng = childTLink.rightnode.centerLatLng;
                  linkLabel.coordinate = {
                    x: Number(leftnodecoordinate.x) + Number(rightnodecoordinate.x) / 2,
                    y: Number(leftnodecoordinate.y) + Number(rightnodecoordinate.y) / 2
                  };
                  var linlLat = (Number(leftnodecenterLatLng.latitude) + Number(rightnodecenterLatLng.latitude)) / 2;
                  var linkLng = (Number(leftnodecenterLatLng.longitude) + Number(rightnodecenterLatLng.longitude)) / 2;
                  linkLabel.centerLatLng.latitude = linlLat;
                  linkLabel.centerLatLng.longitude = linkLng;
                } else {
                  var curveLatLng = childTLink.curveLatLng;
                  var linlLat = Number(curveLatLng.latitude);
                  var linkLng = Number(curveLatLng.longitude);
                  linkLabel.centerLatLng.latitude = linlLat;
                  linkLabel.centerLatLng.longitude = linkLng;
                }
                childTLink.tlabel = linkLabel;
              }
            }
          }
        }

        if (tnode && null != tnode) {
          var trange = new WafTRange();
          trange.style = config.range;
          trange.showname = tnode.showname;
          trange.tnode = tnode;
          tnode.trange = trange;
          if (tnode.isExpanded()) {
            trange.visible = true;
          } else {
            trange.visible = false;
          }

          var objects = me.calcuteCircleCenterLocation(latlngList);
          if (null != objects) {
            trange.centerLatLng = {
              latitude: Number(objects[0].latitude),
              longitude: Number(objects[0].longitude)
            };
            tnode.centerLatLng = {
              latitude: Number(objects[0].latitude),
              longitude: Number(objects[0].longitude)
            };
            trange.params = {};
            trange.params.radius = Number(objects[1]);
          }
        }

  /!*      me.endtime = new Date().getTime(); // 结束时间
        console.log('1. 算radius执行时间为：', (me.endtime - me.startime) / 1000);*!/
      }
      return tnode;
    }
  */

  doPaint(tnode: WafTNode, style: WafTopoStyle, selectedNodes: any, clear: boolean): any {
    if (!this.iTopoMap.hasInitialized()) {
      this.iTopoMap.createMap(style);
      this.iTopoMap.addMenus();
    }
    if (clear) {
      this.iTopoMap.release(null);
    }
    console.log('before paint ------- tnode = ', tnode);
    var allNodes = tnode.childList;
    if (null != allNodes) {
      // 绘制节点
      for (var i = 0; i < allNodes.length; i++) {
        /*if (0 == allNodes[i].type) {
          this.showLogic(allNodes[i].trange, style);
        } else if (1 == allNodes[i].type) {
          this.showNe(allNodes[i], style);
        }*/
        this.showNode(allNodes[i], style);
      }
      // 绘制光纤
      for (var i = 0; i < allNodes.length; i++) {
        var links = allNodes[i].links;
        if (null != links) {
          for (var j = 0; j < links.length; j++) {
            this.showLink(links[j], style);
          }
        }
      }
    }
    console.log('after paint ------- tnode = ', tnode);
  }

  showNode(tnode: WafTNode, config: WafTopoStyle) {
    if (tnode.isPainted()) {
      this.iTopoMap.showOverLay(tnode.realnode);
    } else {
      var node = this.iTopoMap.createNode(tnode, config);
      // 建立自定义模型和三方拓扑模型的一对一关联关系。
      node['model'] = tnode;
      tnode.realnode = node;
      // 标注已绘制
      tnode.painted = true;
      var icons = [];
      if (node['bindingUIs']) {
        node['bindingUIs'].forEach(function (ui) {
          icons.push(ui.ui);
        });
      }
      ;
      var iconChildList = tnode.iconChildList;
      if (null != iconChildList && null != icons) {
        for (var i = 0; i < iconChildList.length; i++) {
          tnode.iconChildList[i].painted = true;
          tnode.iconChildList[i].realnodeicon = icons[i];
        }
      }
      this.iTopoMap.addOverLay(node);
    }
  }

  showLink(tlink: WafTLink, config: WafTopoStyle) {
    if (tlink.isPainted()) {
      this.iTopoMap.showOverLay(tlink.reallink);
    } else {
      var link = this.iTopoMap.createLink(tlink, config);
      // 建立自定义模型和三方拓扑模型的一对一关联关系。
      link['model'] = tlink;
      tlink.reallink = link;
      // 标注已绘制
      tlink.painted = true;
      this.iTopoMap.addOverLay(link);
    }
  }

  /*showLogic(trange:WafTRange, style:WafTopoStyle) {
    var tnode = trange.tnode;
    if (tnode.type != 0) {
      return;
    } else {
      if (tnode.isExpanded()) {
        // 先显示节点
        var childNodes = tnode.childList;
        for (var i = 0; i < childNodes.length; i++) {
          if (0 == childNodes[i].type) {
            this.showLogic(childNodes[i].trange, style);
          } else if (1 == childNodes[i].type) {
            this.showNe(childNodes[i], style);
          }
        }
        var trange = tnode.trange;
        // 后显示域
        trange.visible = true;
        if (trange.isPainted()) {
          this.iTopoMap.showOverLay(trange.realrange);
        } else {
          var trange_node = this.iTopoMap.createRange(trange, style);
          // 将其添加到其父节点上去。
          var parentNode = trange.tnode.parent;
          if (null != parentNode && parentNode.trange != null && parentNode.trange.isPainted()) {
            this.iTopoMap.addChild(parentNode.trange.realrange, trange_node);
          }
          // 添加子节点
          var logicNode = trange.tnode;
          if (null != logicNode) {
            var nodes = logicNode.childList;
            if (nodes && null != nodes) {
              for (var i = 0; i < nodes.length; i++) {
                if (1 == nodes[i].type) {
                  this.iTopoMap.addChild(trange_node, nodes[i].realnode);
                } else if (0 == nodes[i].type) {
                  if (nodes[i].isPainted()) {
                    this.iTopoMap.addChild(trange_node, nodes[i].realnode);
                  }
                  if (nodes[i].trange != null && nodes[i].trange.isPainted()) {
                    this.iTopoMap.addChild(trange_node, nodes[i].trange.realrange);
                  }
                }
              }
            }
          }
          // 建立自定义模型和三方拓扑模型的一对一关联关系。
          trange_node['model'] = trange;
          trange.realrange = trange_node;
          // 标注已绘制
          trange.painted = true;
          this.iTopoMap.addOverLay(trange_node);
        }
      } else {
        // 显示闭合逻辑域
        tnode.visible = true;
        if (tnode.isPainted()) {
          this.iTopoMap.showOverLay(tnode.realnode);
        } else {
          var tLogicNode = this.iTopoMap.createNode(tnode, style);
          // 将其添加到其父节点上去。
          var parentNode = tnode.parent;
          if (null != parentNode && parentNode.trange != null && parentNode.trange.isPainted()) {
            this.iTopoMap.addChild(parentNode.trange.realrange, tLogicNode);
          }
          // 建立自定义模型和三方拓扑模型的一对一关联关系。
          tLogicNode['model'] = tnode;
          tnode.realnode = tLogicNode;
          // 标注已绘制
          tnode.painted = true;
          this.iTopoMap.addOverLay(tLogicNode);
        }
      }
    }
  }

  showNe(tnode:WafTNode, config:WafTopoStyle) {
    if (tnode.type != 1) {
      return;
    } else {
      tnode.visible = true;
      if (tnode.isPainted()) {
        this.iTopoMap.showOverLay(tnode.realnode);
      } else {
        var node = this.iTopoMap.createNode(tnode, config);
        // 建立自定义模型和三方拓扑模型的一对一关联关系。
        node['model'] = tnode;
        tnode.realnode = node;
        // 标注已绘制
        tnode.painted = true;
        this.iTopoMap.addOverLay(node);
      }
    }
  }*/

  /*doPaint(tnode:WafTNode, sysconfig:any, selectednode:any):any {
    var me = this;
    var returnTNode:any = null;
    console.log('start to paint topo........', tnode);
    console.log('start to paint topo........', sysconfig);
    var linkHasLabel = sysconfig.link.hasLabel
    var multiLink = sysconfig.link.multiLink
    var autoBind = sysconfig.range.autoBind
    var physicaltopo = sysconfig.map.physicaltopo;
    if (!this.iTopoMap.hasInitialized()) {
      this.iTopoMap.createMap(sysconfig);
    }
    if (tnode && null != tnode) {
      // 顶层逻辑域必然显示。
      if (tnode.isVisible()) {
        // 若DC展开
        if (tnode.type == 0 && tnode.isExpanded()) {
          // 若DC域未绘制
          if (!tnode.isPainted()) {
            var newDcTNode = this.iTopoMap.createNode(tnode);
            if (null != newDcTNode) {
              tnode.painted = true;
              // 建立自定义模型和三方拓扑模型的一对一关联关系。
              newDcTNode['model'] = tnode;
              tnode.realnode = newDcTNode;
              this.iTopoMap.addOverLay(newDcTNode);
            }
            // 绘制网元。
            var neNodes = tnode.childList;
            for (var i = 0; i < neNodes.length; i++) {
              // 逻辑域展开，网元必然可见。
              if (neNodes[i].isVisible()) {
                if (!neNodes[i].isPainted()) {
                  var newNeTNode = this.iTopoMap.createNode(neNodes[i]);
                  if (null != newNeTNode) {
                    neNodes[i].painted = true;
                    // 建立自定义模型和三方拓扑模型的一对一关联关系。
                    newNeTNode['model'] = neNodes[i];
                    neNodes[i].realnode = newNeTNode;
                    this.iTopoMap.addOverLay(newNeTNode);
                    if (selectednode != null) {
                      if (selectednode.id == neNodes[i].id) {
                        returnTNode = neNodes[i];
                      }
                    }
                  }
                }
              }
            }

            // 绘制TRange
            if (tnode.trange && null != tnode.trange && tnode.trange.isVisible() && !tnode.trange.isPainted()) {
              var newDcTRange = this.iTopoMap.createRange(tnode.trange);
              if (null != newDcTRange) {
                tnode.trange.painted = true;
                // 建立自定义模型和三方拓扑模型的一对一关联关系。
                newDcTRange['model'] = tnode.trange;
                tnode.trange.realrange = newDcTRange;
                this.iTopoMap.addOverLay(newDcTRange);
              }
            }

            // 绘制node的光纤。
            for (var i = 0; i < neNodes.length; i++) {
              var links = neNodes[i].getLinksByType(1);
              // 由于逻辑域展开，因此只绘制网元-网元之间的光纤。
              if (links && null != links) {
                for (var j = 0; j < links.length; j++) {
                  if (links[j] && null != links[j] && links[j].isVisible() && !links[j].isPainted()) {
                    // 支持多光纤。
                    var newNeTLink = this.iTopoMap.createLink(links[j]);
                    if (null != newNeTLink) {
                      links[j].painted = true;
                      // 建立自定义模型和三方拓扑模型的一对一关联关系。
                      newNeTLink['model'] = links[j];
                      links[j].reallink = newNeTLink;
                      this.iTopoMap.addOverLay(newNeTLink);
                    }
                    // 判断链路的名称是否需要额外创建，如果是，这里需要额外创建。
                    if (false == linkHasLabel) {
                      var linkLabel = links[j].tlabel;
                      if (linkLabel.isVisible()) {
                        if (!linkLabel.isPainted()) {
                          var newLinkLabel = this.iTopoMap.createLabel(linkLabel);
                          if (null != newLinkLabel) {
                            linkLabel.painted = true;
                            // 建立自定义模型和三方拓扑模型的一对一关联关系。
                            newLinkLabel['model'] = linkLabel;
                            linkLabel.reallabel = newLinkLabel;
                            this.iTopoMap.addOverLay(newLinkLabel);
                          }
                        } else {
                          this.iTopoMap.showOverLay(linkLabel.reallabel);
                        }
                      } else {
                        if (linkLabel.isPainted()) {
                          this.iTopoMap.hideOverLay(linkLabel.reallabel);
                        }
                      }
                    }
                  }
                }
              }
            }
          } else {
            this.doUpdate(0, {tnode: tnode});
            // 绘制网元
            var neNodes = tnode.childList;
            for (var i = 0; i < neNodes.length; i++) {
              // 逻辑域展开，网元必然可见。
              if (neNodes[i].isVisible()) {
                if (!neNodes[i].isPainted()) {
                  var newNeTNode = this.iTopoMap.createNode(neNodes[i]);
                  if (null != newNeTNode) {
                    neNodes[i].painted = true;
                    // 建立自定义模型和三方拓扑模型的一对一关联关系。
                    newNeTNode['model'] = neNodes[i];
                    neNodes[i].realnode = newNeTNode;
                    this.iTopoMap.addOverLay(newNeTNode);
                  }
                } else {
                  // 还需要更新一下网元的名称。
                  this.iTopoMap.updateNode(neNodes[i], 1);
                  this.iTopoMap.showOverLay(neNodes[i].realnode);
                }
              }
            }
            // 绘制TRange
            if (tnode.trange && null != tnode.trange && tnode.trange.isVisible()) {
              if (!tnode.trange.isPainted()) {
                var newDcTRange = this.iTopoMap.createRange(tnode.trange);
                if (null != newDcTRange) {
                  tnode.trange.painted = true;
                  // 建立自定义模型和三方拓扑模型的一对一关联关系。
                  newDcTRange['model'] = tnode.trange;
                  tnode.trange.realrange = newDcTRange;
                  this.iTopoMap.addOverLay(newDcTRange);
                }
              } else {
                // 若已绘制TRange，则需要重新绑定网元
                if (physicaltopo) {
                  this.iTopoMap.updateNode(tnode, 2);
                }
                this.iTopoMap.updateRange(tnode.trange);
                this.iTopoMap.showOverLay(tnode.trange.realrange);
              }
            }
            // 绘制node的光纤。
            for (var i = 0; i < neNodes.length; i++) {
              var links = neNodes[i].getLinksByType(1);
              // 由于逻辑域展开，因此只绘制网元-网元之间的光纤。
              if (links && null != links) {
                for (var j = 0; j < links.length; j++) {
                  if (links[j] && null != links[j] && links[j].isVisible()) {
                    if (!links[j].isPainted()) {
                      var newNeTLink = this.iTopoMap.createLink(links[j]);
                      if (null != newNeTLink) {
                        links[j].painted = true;
                        // 建立自定义模型和三方拓扑模型的一对一关联关系。
                        newNeTLink['model'] = links[j];
                        links[j].reallink = newNeTLink;
                        this.iTopoMap.addOverLay(newNeTLink);
                      }
                      // 判断链路的名称是否需要额外创建，如果是，这里需要额外创建。
                      if (false == linkHasLabel) {
                        var linkLabel = links[j].tlabel;
                        if (linkLabel.isVisible()) {
                          if (!linkLabel.isPainted()) {
                            var newLinkLabel = this.iTopoMap.createLabel(linkLabel);
                            if (null != newLinkLabel) {
                              linkLabel.painted = true;
                              // 建立自定义模型和三方拓扑模型的一对一关联关系。
                              newLinkLabel['model'] = linkLabel;
                              linkLabel.reallabel = newLinkLabel;
                              this.iTopoMap.addOverLay(newLinkLabel);
                            }
                          } else {
                            this.iTopoMap.showOverLay(linkLabel.reallabel);
                          }
                        } else {
                          if (linkLabel.isPainted()) {
                            this.iTopoMap.hideOverLay(linkLabel.reallabel);
                          }
                        }
                      }
                    } else {
                      this.iTopoMap.showOverLay(links[j].reallink);
                      // 判断链路的名称是否需要额外创建，如果是，这里需要额外创建。
                      if (false == linkHasLabel) {
                        var linkLabel = links[j].tlabel;
                        if (linkLabel.isVisible()) {
                          if (!linkLabel.isPainted()) {
                            var newLinkLabel = this.iTopoMap.createLabel(linkLabel);
                            if (null != newLinkLabel) {
                              linkLabel.painted = true;
                              // 建立自定义模型和三方拓扑模型的一对一关联关系。
                              newLinkLabel['model'] = linkLabel;
                              linkLabel.reallabel = newLinkLabel;
                              this.iTopoMap.addOverLay(newLinkLabel);
                            }
                          } else {
                            this.iTopoMap.showOverLay(linkLabel.reallabel);
                          }
                        } else {
                          if (linkLabel.isPainted()) {
                            this.iTopoMap.hideOverLay(linkLabel.reallabel);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else if (tnode.type == 0 && !tnode.isExpanded()) {
          // DC闭合
          // 若DC域未绘制
          if (!tnode.isPainted()) {
            var newDcTNode = this.iTopoMap.createNode(tnode);
            if (null != newDcTNode) {
              tnode.painted = true;
              // 建立自定义模型和三方拓扑模型的一对一关联关系。
              newDcTNode['model'] = tnode;
              tnode.realnode = newDcTNode;
              this.iTopoMap.addOverLay(newDcTNode);
              // 添加新节点之后，如果是物理视图，需要修改逻辑域坐标。
              if (physicaltopo) {
                this.iTopoMap.updateNode(tnode, 2);
              }
            }
          } else {
            // 添加新节点之后，如果是物理视图，需要修改逻辑域坐标。
            if (physicaltopo) {
              this.iTopoMap.updateNode(tnode, 2);
            }
            // 若已绘制，则隐藏trange，和其下节点。
            var trange = tnode.trange;
            if (trange && null != trange && !trange.isVisible() && trange.isPainted()) {
              this.iTopoMap.hideOverLay(trange.realrange);
              this.doUpdate(1, {tnode: tnode});
            }
            // 隐藏节点
            var nenodes = tnode.childList;
            if (nenodes && null != nenodes) {
              for (var i = 0; i < nenodes.length; i++) {
                if (nenodes[i].isPainted() && !nenodes[i].isVisible()) {
                  // 还需要更新一下网元的名称。
                  this.iTopoMap.updateNode(nenodes[i], 1);
                  this.iTopoMap.hideOverLay(nenodes[i].realnode);
                  // 隐藏光纤
                  var nenodelinks = nenodes[i].links;
                  // 这里是DC，所以不区分光纤类型。
                  if (nenodelinks && null != nenodelinks) {
                    for (var j = 0; j < nenodelinks.length; j++) {
                      if (nenodelinks[j].isPainted() && !nenodelinks[j].isVisible()) {
                        this.iTopoMap.hideOverLay(nenodelinks[j].reallink);
                        // 隐藏linklabel
                        if (false == linkHasLabel) {
                          if (nenodelinks[j].tlabel.isPainted() && !nenodelinks[j].tlabel.isVisible()) {
                            this.iTopoMap.hideOverLay(nenodelinks[j].tlabel.reallabel);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    console.log('end to paint topo........');
    return returnTNode;
  }*/

  doUpdate(opType: number, params: any, style: WafTopoStyle): void {
    if (0 == opType) {
      // 清空画布
      var oldModel = params['oldModel'];
      var newModel = params['newModel'];
      // 缓存更新
      this.refreshCache(oldModel, false);
      // 重新绘制
      this.doPaint(newModel, style, null, true);
      // 节点选中
      var selectedNodes = params['selectedNodes'];
      if (null != selectedNodes) {
        this.iTopoMap.setSection(selectedNodes);
      }
    } else if (1 == opType) {
      this.iTopoMap.setCurrentMode(1);
    } else if (2 == opType) {
      this.iTopoMap.setCurrentMode(2);
    } else if (3 == opType) {
      this.iTopoMap.setCurrentMode(3);
    } else if (4 == opType) {
      this.iTopoMap.zoomIn();
    } else if (5 == opType) {
      this.iTopoMap.zoomOut();
    } else if (6 == opType) {
      this.iTopoMap.centerAndZoom(null);
    } else if (8 == opType) {
      // 保存坐标
      var model = params['model'];
      if (null != model) {
        if (1 == model.type) {
          var loc = this.iTopoMap.getNodeLocation(model['realnode']);
          model.coordinate = loc;
          // model.showname = 'node[' + model.coordinate.x + ',' + model.coordinate.y + ']';
          // this.iTopoMap.updateNode(model, 1);
          this.resetLoc(model, 0, 0, 'up');
        } else if (0 == model.type || 2 == model.type) {
          var preLoc = model.coordinate;
          var curLoc = this.iTopoMap.getNodeLocation(model['realnode']);
          model.coordinate = curLoc;
          // model.showname = 'group[' + model.coordinate.x + ',' + model.coordinate.y + ']';
          // this.iTopoMap.updateNode(model, 1);
          var dx = curLoc.x - preLoc.x;
          var dy = curLoc.y - preLoc.y;
          this.resetLoc(model, dx, dy, 'down');
          this.resetLoc(model, dx, dy, 'up');
        }
      }
    } else if (9 == opType) {
      var overview = document.getElementById('overview-' + params['me']);
      if (overview && overview.style.display == '') {
        overview.style.display = 'none';
      } else {
        overview.style.display = '';
      }
    } else if (10 == opType) {
      // topo refresh
      var model = params['model'];
      var childNodes = model.childList;
      if (null != childNodes) {
        for (var i = 0; i < childNodes.length; i++) {
          /*if (childNodes[i].deleted == true) {
            // do delete
            this.iTopoMap.removeOverLay(childNodes[i].realnode);
            model.childList.splice(i--, 1);
          } else if (childNodes[i].painted == false && childNodes[i].deleted == false) {
            // do add
            var node = this.iTopoMap.createNode(childNodes[i], style);
            // 建立自定义模型和三方拓扑模型的一对一关联关系。
            node['model'] = childNodes[i];
            childNodes[i].realnode = node;
            // 标注已绘制
            childNodes[i].painted = true;
            this.iTopoMap.addOverLay(node);
          }*/
          // 仅处理更新update
          this.iTopoMap.updateNode(childNodes[i], 2, null);
        }
      }
    } else if (11 == opType) {
      var tnode = params['model'];
      var node = this.iTopoMap.createNode(tnode, style);
      // 建立自定义模型和三方拓扑模型的一对一关联关系。
      node['model'] = tnode;
      tnode.realnode = node;
      // 标注已绘制
      tnode.painted = true;
      var icons = [];
      if (node['bindingUIs']) {
        node['bindingUIs'].forEach(function (ui) {
          icons.push(ui.ui);
        });
      }
      var iconChildList = tnode.iconChildList;
      if (null != iconChildList && null != icons) {
        for (var i = 0; i < iconChildList.length; i++) {
          iconChildList[i].painted = true;
          iconChildList[i].realnodeicon = icons[i];
        }
      }
      this.iTopoMap.addOverLay(node);
    } else if (12 == opType) {
      var tnode = params['model'];
      this.iTopoMap.removeOverLay(tnode.realnode);
    } else if (13 == opType) {
      var tlink = params['model'];
      if (tlink.isPainted()) {
        this.iTopoMap.showOverLay(tlink.reallink);
      } else {
        var link = this.iTopoMap.createLink(tlink, style);
        // 建立自定义模型和三方拓扑模型的一对一关联关系。
        link['model'] = tlink;
        tlink.reallink = link;
        // 标注已绘制
        tlink.painted = true;
        this.iTopoMap.addOverLay(link);
      }
    } else if (14 == opType) {
      var tnode = params['model'];
      var icon = params['icon'];
      var newIcon = this.iTopoMap.updateNode(tnode, 3, {icon: icon});
      icon.painted = true;
      icon.realnodeicon = newIcon;
    } else if (15 == opType) {
      var tlink = params['model'];
      this.iTopoMap.removeOverLay(tlink.reallink);
    } else if (16 == opType) {
      var tnode = params['model'];
      var curModel = params['curModel'];
      if (tnode.parent == curModel) {
        // 动态删除小图标(网元位于当前视口)
        var iconChildList = tnode.iconChildList;
        if (null != iconChildList) {
          for (var i = 0; i < iconChildList.length; i++) {
            if (iconChildList[i].deleted == true) {
              if (null != tnode.realnode && null != iconChildList[i].realnodeicon) {
                console.log('WafTopologyService执行删除：', iconChildList[i]);
                this.iTopoMap.updateNode(tnode, 4, {'model': iconChildList[i]});
              }
              tnode.iconChildList.splice(i--, 1);
            }
          }
        }
      } else {
        // 动态删除小图标(网元不位于当前视口)
        var iconChildList = tnode.iconChildList;
        if (null != iconChildList) {
          for (var i = 0; i < iconChildList.length; i++) {
            if (iconChildList[i].deleted == true) {
              tnode.iconChildList.splice(i--, 1);
            }
          }
        }
      }
    } else if (17 == opType) {
      var tnode = params['model'];
      this.iTopoMap.updateNode(tnode, 5, null);
    } else if (18 == opType) {
      var tnode = params['model'];
      this.iTopoMap.updateNode(tnode, 1, null);
    }
  }

  resetLoc(model: WafTNode, dx: number, dy: number, direction: string) {
    if ('down' == direction) {
      var childNodes = model.childList;
      if (null != childNodes) {
        for (var i = 0; i < childNodes.length; i++) {
          if (childNodes[i].type == 0 || childNodes[i].type == 2) {
            var preLoc = childNodes[i].coordinate;
            childNodes[i].coordinate = {x: preLoc.x + dx, y: preLoc.y + dy};
            // childNodes[i].showname = 'group[' + childNodes[i].coordinate.x + ',' + childNodes[i].coordinate.y + ']';
            // this.iTopoMap.updateNode(childNodes[i], 1);
            this.resetLoc(childNodes[i], dx, dy, direction);
          } else if (childNodes[i].type == 1) {
            var preLoc = childNodes[i].coordinate;
            childNodes[i].coordinate = {x: preLoc.x + dx, y: preLoc.y + dy};
            // childNodes[i].showname = 'node[' + childNodes[i].coordinate.x + ',' + childNodes[i].coordinate.y + ']';
            // this.iTopoMap.updateNode(childNodes[i], 1);
          }
        }
      }
    } else if ('up' == direction) {
      var parent = model.parent;
      if (null != parent) {
        var childNodes = parent.childList;
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
          parent.coordinate = {x: minX, y: minY};
          // parent.showname = 'group[' + minX + ',' + minY + ']';
          // this.iTopoMap.updateNode(parent, 1);
        }
      }
    }
  }

  refreshCache(tnode: WafTNode, isPainted: boolean) {
    if (null != tnode && null != tnode.childList) {
      for (var i = 0; i < tnode.childList.length; i++) {
        // 清除节点
        tnode.childList[i].painted = isPainted;
        tnode.childList[i].realnode = null;
        // 清除连纤
        var links = tnode.childList[i].links;
        if (null != links) {
          for (var j = 0; j < links.length; j++) {
            links[j].painted = isPainted;
            links[j].reallink = null;
          }
        }
      }
    }
  }

  /*reLocateTNode(tnode:WafTNode, dx:number, dy:number) {
    if (null != tnode && 0 == tnode.type) {
      var childNodes = tnode.childList;
      for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].type == 0 && childNodes[i].isExpanded()) {
          this.reLocateTNode(childNodes[i], dx, dy);
        } else if ((childNodes[i].type == 0 && !childNodes[i].isExpanded()) || childNodes[i].type == 1) {
          childNodes[i].coordinate['x'] += (dx + 60);
          childNodes[i].coordinate['y'] += (dy + 60);
        }
      }
    }
  }*/

  /*getRangeBounds(bounds:Object, tnode:WafTNode) {
    if (null == bounds) {
      bounds = this.iTopoMap.createRect();
    }
    if (null != tnode && 0 == tnode.type) {
      var childNodes = tnode.childList;
      for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].type == 0 && childNodes[i].isExpanded()) {
          this.getRangeBounds(bounds, childNodes[i]);
        } else if ((childNodes[i].type == 0 && !childNodes[i].isExpanded()) || childNodes[i].type == 1) {
          this.iTopoMap.addToRect(bounds, childNodes[i].coordinate['x'], childNodes[i].coordinate['y']);
        }
      }
      return {x:bounds['x'], y:bounds['y']};
    }
  }*/

  centerAndZoom(tnode: WafTNode): void {
    if (this.iTopoMap.hasInitialized()) {
      this.iTopoMap.centerAndZoom(tnode);
    }
  }

  panTo(type: number, config: Object) {
    if (this.iTopoMap.hasInitialized()) {
      this.iTopoMap.panTo(type, config);
    }
  }

  getTopoIcon(name, type: number, config: any) {
    var physicaltopo = config.map.physicaltopo;
    if (!physicaltopo) {
      if (type == 0) {

        return "./resources/images/defaultnelogo.png";

      } else if (type == 1) {
        return "./resources/images/breakdown.png";
      } else if (type == 2) {
        return "./resources/images/alarm.png";
      }
    } else {
      if (type == 0) {

        return "./resources/images/topology/defaultnelogo.png";

      } else if (type == 1) {
        return "./resources/images/topology/wrongnelogo.png";
      } else if (type == 2) {
        return "./resources/images/topology/alarm.png";
      }
    }
  }

  hideLogic(trange: WafTRange, style: WafTopoStyle) {
    if (null != trange) {
      var tnode = trange.tnode;
      if (0 != tnode.type) {
        return;
      } else {
        if (null != trange && !tnode.isExpanded()) {
          tnode.visible = false;
          if (tnode.isPainted()) {
            this.iTopoMap.hideOverLay(tnode.realnode);
          }
        } else if (null != trange && tnode.isExpanded()) {
          var childNodes = tnode.childList;
          if (childNodes && null != childNodes) {
            for (var i = 0; i < childNodes.length; i++) {
              if (0 == childNodes[i].type) {
                this.hideLogic(childNodes[i].trange, style);
              } else if (1 == childNodes[i].type) {
                this.hideNe(childNodes[i], style);
              }
            }
          }
          trange.visible = false;
          if (trange.isPainted()) {
            this.iTopoMap.hideOverLay(trange.realrange);
          }
        }
      }
    }
  }

  hideNe(tnode: WafTNode, style: WafTopoStyle) {
    if (null != tnode) {
      if (1 != tnode.type) {
        return;
      } else {
        tnode.visible = false;
        if (tnode.isPainted()) {
          this.iTopoMap.hideOverLay(tnode.realnode);
        }
      }
    }
  }

  destroy() {
    this.iTopoMap.destroy();
  }

  /*handleTNodeStatusByUser(tnode:WafTNode, action:number, config:any) {
    // 逻辑域展开
    if (0 == action) {
      var linkHasLabel = config.link.hasLabel;
      var showlinename = config.showlinename;
      if (null != tnode) {
        var tRange = tnode.trange;
        tRange.visible = true;
        tnode.expanded = true;
        tnode.imgsrc = './resources/images/logicexpand.png';
        tnode.showimgsrc = './resources/images/logicexpand.png';
        // 设置其孩子节点可见。
        var nenodes = tnode.childList;
        if (nenodes && null != nenodes) {
          for (var i = 0; i < nenodes.length; i++) {
            nenodes[i].visible = true;
            // 显示光纤
            var nenodelinks = nenodes[i].links;
            // 这里是DC，所以不区分光纤类型。
            if (nenodelinks && null != nenodelinks) {
              for (var j = 0; j < nenodelinks.length; j++) {
                if (!nenodelinks[j].isVisible()) {
                  nenodelinks[j].visible = true;
                }
                if (false == linkHasLabel) {
                  if (showlinename) {
                    if (!nenodelinks[j].tlabel.isVisible()) {
                      nenodelinks[j].tlabel.visible = true;
                    }
                  } else {
                    nenodelinks[j].tlabel.visible = false;
                  }
                }
              }
            }
          }
        }
      }
    } else if (1 == action) {
      var linkHasLabel = config.link.hasLabel;
      var showlinename = config.showlinename;
      // 逻辑域收拢
      if (null != tnode) {
        var tRange = tnode.trange;
        tRange.visible = false;
        tnode.expanded = false;
        tnode.imgsrc = './resources/images/logiccollapse.png';
        tnode.showimgsrc = './resources/images/logiccollapse.png';
        // 设置其孩子节点不可见。
        var nenodes = tnode.childList;
        if (nenodes && null != nenodes) {
          for (var i = 0; i < nenodes.length; i++) {
            nenodes[i].visible = false;
            // 隐藏光纤
            var nenodelinks = nenodes[i].links;
            // 这里是DC，所以不区分光纤类型。
            if (nenodelinks && null != nenodelinks) {
              for (var j = 0; j < nenodelinks.length; j++) {
                if (nenodelinks[j].isVisible()) {
                  nenodelinks[j].visible = false;
                }
                if (false == linkHasLabel) {
                  if (nenodelinks[j].tlabel.isVisible()) {
                    nenodelinks[j].tlabel.visible = false;
                  }
                }
              }
            }
          }
        }
      }
    } else if (2 == action) {
      // 网元选中
      var physicaltopo = config.map.physicaltopo;
      if (!physicaltopo) {
        tnode.showimgsrc = './resources/images/choosednelogo.png';
      } else {
        tnode.showimgsrc = './resources/images/topology/choosednelogo.png';
      }
      // 将之前选中的网元的颜色恢复.
      var selectedtoponodes = config.selectedtoponodes;
      if (selectedtoponodes && null != selectedtoponodes) {
        for (var i = 0; i < selectedtoponodes.length; i++) {
          if (selectedtoponodes[i] != tnode) {
            selectedtoponodes[i].showimgsrc = selectedtoponodes[i].imgsrc;
          }
        }
      }
    } else if (3 == action) {
      // 显示切换
      var showname = config.showname;
      if (null != tnode) {
        for (var i = 0; i < tnode.childList.length; i++) {
          if ('ip' == showname) {
            tnode.childList[i].showname = tnode.childList[i].ip;
          } else if ('name' == showname) {
            tnode.childList[i].showname = tnode.childList[i].name;
          } else if ('ip&name' == showname || 'name&ip' == showname) {
            tnode.childList[i].showname = tnode.childList[i].name + '(' + tnode.childList[i].ip + ')';
          } else {
            tnode.childList[i].showname = '';
          }
        }
      }
    } else if (4 == action) {
      // 显示切换
      var showlinename = config.showlinename;
      if (null != tnode) {
        for (var i = 0; i < tnode.childList.length; i++) {
          var nodelinks = tnode.childList[i].links;
          for (var j = 0; j < nodelinks.length; j++) {
            if (showlinename) {
              nodelinks[j].showname = nodelinks[j].name;
              var linklabel = nodelinks[j].tlabel;
              if (null != linklabel) {
                linklabel.visible = true;
              }
            } else {
              nodelinks[j].showname = '';
              var linklabel = nodelinks[j].tlabel;
              if (null != linklabel) {
                linklabel.visible = false;
              }
            }
          }
        }
      }
    }
  }*/

  handleTNodeStatusByWebsocket(msg: any, config: any, type: number, tnode: WafTNode) {

  }

  /*handleTNodeStatusByWebsocket(msg:any, config:any, type:number, tnode:WafTNode) {
    if (0 == type) {
      // 网元添加
      var parentNcdId = msg.nodes[0].parentNcdId;
      var nodesize = config.node.size;
      var autoBind = config.range.autoBind;
      if (parentNcdId == tnode.id) {
        var childTnode = new WafTNode();
        childTnode.style = config.node;
        childTnode.id = msg.nodes[0].id;
        childTnode.type = 1;
        childTnode.name = msg.nodes[0].name;
        childTnode.ip = msg.nodes[0].ip;
        var nodeshowname = config.nodeshowname;
        if ('' == nodeshowname) {
          childTnode.showname = '';
        } else if ('name&ip' == nodeshowname || 'ip&name' == nodeshowname) {
          childTnode.showname = childTnode.name + '(' + childTnode.ip + ')';
        } else if ('name' == nodeshowname) {
          childTnode.showname = childTnode.name;
        } else if ('ip' == nodeshowname) {
          childTnode.showname = childTnode.ip;
        }
        childTnode.status = msg.nodes[0].status;
        var physicaltopo = config.map.physicaltopo;
        if (!physicaltopo) {
          // 判断网元是否已绘制上去。
          if (tnode.childList != null && tnode.childList.length > 0) {
            if (tnode.childList[0].isPainted()) {
              // 已绘制
              var minX = -1;
              var maxX = -1;
              var minY = -1;
              var maxY = -1;
              for (var t = 0; t < tnode.childList.length; t++) {
                if (tnode.childList[t].isPainted()) {
                  var nodelocation = this.iTopoMap.getNodeLocation(tnode.childList[t]);
                  if (Number(nodelocation.x) < minX) {
                    minX = Number(nodelocation.x);
                  }
                  if (Number(nodelocation.x) > maxX) {
                    maxX = Number(nodelocation.x);
                  }
                  if (Number(nodelocation.y) < minY) {
                    minY = Number(nodelocation.y);
                  }
                  if (Number(nodelocation.y) > maxY) {
                    maxY = Number(nodelocation.y);
                  }
                }
              }
              var width = maxX - minX;
              var height = maxY - minY;
              childTnode.coordinate = {
                x: minX + 1 / 2 * width + Math.random() * 50,
                y: minY + 1 / 2 * height + Math.random() * 50
              };
            } else {
              // 未绘制
              var minX = -1;
              var maxX = -1;
              var minY = -1;
              var maxY = -1;
              for (var t = 0; t < tnode.childList.length; t++) {
                var nodecoordinate = tnode.childList[t].coordinate;
                var nodeloc = {x: Number(nodecoordinate.x), y: Number(nodecoordinate.y)};
                if (nodeloc.x < minX) {
                  minX = nodeloc.x;
                }
                if (nodeloc.x > maxX) {
                  maxX = nodeloc.x;
                }
                if (nodeloc.y < minY) {
                  minY = nodeloc.y;
                }
                if (nodeloc.y > maxY) {
                  maxY = nodeloc.y;
                }
              }
              var width = maxX - minX;
              var height = maxY - minY;
              childTnode.coordinate = {
                x: minX + 1 / 2 * width + Math.random() * 50,
                y: minY + 1 / 2 * height + Math.random() * 50
              };
            }
          } else {
            // 若域内无网元，则新增的网元坐标在域旁边。
            var nodelocation = this.iTopoMap.getNodeLocation(tnode);
            var nodeloc = {x: Number(nodelocation.x), y: Number(nodelocation.y)};
            childTnode.coordinate = {x: nodeloc.x + Math.random() * 50, y: nodeloc.y + Math.random() * 50};
          }
        } else {
          // 物理拓扑
          var newnodelatitude = msg.nodes[0].latitude;
          var newnodelongitude = msg.nodes[0].longitude;
          childTnode.centerLatLng = {latitude: newnodelatitude, longitude:newnodelongitude};
        }
        childTnode.level = 2;
        childTnode.links = [];
        if (tnode.expanded) {
          childTnode.visible = true;
        } else {
          childTnode.visible = false;
        }
        childTnode.imgsrc = this.getTopoIcon(childTnode.name, 0, config);
        childTnode.showimgsrc = this.getTopoIcon(childTnode.name, 0, config);
        if (childTnode.status == 0) {
          childTnode.imgsrc = this.getTopoIcon(childTnode.name, 0, config);
          childTnode.showimgsrc = this.getTopoIcon(childTnode.name, 0, config);
        } else if (childTnode.status == 1) {
          childTnode.imgsrc = this.getTopoIcon(childTnode.name, 1, config);
          childTnode.showimgsrc = this.getTopoIcon(childTnode.name, 1, config);
        } else if (childTnode.status == 2) {
          childTnode.imgsrc = this.getTopoIcon(childTnode.name, 2, config);
          childTnode.showimgsrc = this.getTopoIcon(childTnode.name, 2, config);
        }
        childTnode.imgstyle = {w: nodesize.w, h: nodesize.h};

        childTnode.painted = false;
        childTnode.parent = tnode;
        tnode.childList.push(childTnode);
        if (false == autoBind) {
          // 对于物理拓扑，重新计算range的半径和中心点。
          if (physicaltopo) {
            var latlngList = [];
            for (var t = 0; t < tnode.childList.length; t++) {
              latlngList.push({latitude:Number(tnode.childList[t].centerLatLng.latitude), longitude:Number(tnode.childList[t].centerLatLng.longitude)});
            }
            var objects = this.calcuteCircleCenterLocation(latlngList);
            if (null != objects) {
              tnode.trange.centerLatLng = {
                latitude: Number(objects[0].latitude),
                longitude: Number(objects[0].longitude)
              };
              tnode.centerLatLng = {
                latitude: Number(objects[0].latitude),
                longitude: Number(objects[0].longitude)
              };
              tnode.trange.params = {};
              tnode.trange.params.radius = Number(objects[1]);
            }
          }
        }
      }
    } else if (1 == type) {
      // 网元删除
      var deletedId = msg.nodes[0].id;
      var physicaltopo = config.map.physicaltopo;
      if (!physicaltopo) {
        // 逻辑拓扑删除网元
        if (tnode.childList && null != tnode.childList) {
          var findNode = false;
          for (var i = 0; i < tnode.childList.length; i++) {
            if (tnode.childList[i].id == deletedId) {
              findNode = true;
              // 设置删除标记。
              console.log('已找到待删除的网元,id = ', deletedId);
              break;
            }
          }
          if (findNode == false) {
            console.log('没有发现待删除的网元,id = ', deletedId);
            return false;
          }
        }
      } else {
        // 物理拓扑删除网元
        if (tnode.childList && null != tnode.childList) {
          var findNode = false;
          for (var i = 0; i < tnode.childList.length; i++) {
            if (tnode.childList[i].id == deletedId) {
              findNode = true;
              // 设置删除标记。
              console.log('已找到待删除的网元,id = ', deletedId);
              break;
            }
          }
          if (findNode == false) {
            console.log('没有发现待删除的网元,id = ', deletedId);
            return false;
          }
        }
      }
    } else if (2 == type) {
      // 网元更新
      var updateId = msg.nodes[0].id;
      var newstatus = msg.nodes[0].status;
      var physicaltopo = config.map.physicaltopo;
      if (!physicaltopo) {
        // 逻辑拓扑网元更新
        if (tnode.childList && null != tnode.childList) {
          for (var i = 0; i < tnode.childList.length; i++) {
            if (tnode.childList[i].id == updateId) {
              console.log('已找到待更新的网元,id = ', updateId);
              tnode.childList[i].status = newstatus;
              if (newstatus == 0) {
                tnode.childList[i].imgsrc = this.getTopoIcon(tnode.childList[i].name, 0, config);
                tnode.childList[i].showimgsrc = this.getTopoIcon(tnode.childList[i].name, 0, config);
              } else if (newstatus == 1) {
                tnode.childList[i].imgsrc = this.getTopoIcon(tnode.childList[i].name, 1, config);
                tnode.childList[i].showimgsrc = this.getTopoIcon(tnode.childList[i].name, 1, config);
              } else if (newstatus == 2) {
                tnode.childList[i].imgsrc = this.getTopoIcon(tnode.childList[i].name, 2, config);
                tnode.childList[i].showimgsrc = this.getTopoIcon(tnode.childList[i].name, 2, config);
              }
              break;
            }
          }
        }
      } else {
        // 物理拓扑网元更新
        if (tnode.childList && null != tnode.childList) {
          for (var i = 0; i < tnode.childList.length; i++) {
            if (tnode.childList[i].id == updateId) {
              console.log('已找到待更新的网元,id = ', updateId);
              tnode.childList[i].status = newstatus;
              if (newstatus == 0) {
                tnode.childList[i].imgsrc = this.getTopoIcon(tnode.childList[i].name, 0, config);
                tnode.childList[i].showimgsrc = this.getTopoIcon(tnode.childList[i].name, 0, config);
              } else if (newstatus == 1) {
                tnode.childList[i].imgsrc = this.getTopoIcon(tnode.childList[i].name, 1, config);
                tnode.childList[i].showimgsrc = this.getTopoIcon(tnode.childList[i].name, 1, config);
              } else if (newstatus == 2) {
                tnode.childList[i].imgsrc = this.getTopoIcon(tnode.childList[i].name, 2, config);
                tnode.childList[i].showimgsrc = this.getTopoIcon(tnode.childList[i].name, 2, config);
              }
              break;
            }
          }
        }
      }
    } else if (3 == type) {
      // 链路添加。
      var linkId = msg.links[0].id;
      var linkName = msg.links[0].name;
      var linkStatus = msg.links[0].status;
      var leftNodeId = msg.links[0].leftNodeId;
      var rightNodeId = msg.links[0].rightNodeId;
      var lineshowname = config.lineshowname;
      var physicaltopo = config.map.physicaltopo;
      var linkHasLabel = config.link.hasLabel;
      var multiLink = config.link.multiLink;
      if (!physicaltopo) {
        // 逻辑拓扑链路添加。
        var leftNode = tnode.findTNodeById(leftNodeId);
        var rightNode = tnode.findTNodeById(rightNodeId);
        if (null == leftNode || null == rightNode) {
          console.log('添加的链路两端网元至少有一个不存在...');
          return false;
        } else {
          var childTLink = new WafTLink();
          childTLink.style = config.link;
          childTLink.id = linkId;
          childTLink.name = linkName;
          if (lineshowname) {
            childTLink.showname = linkName;
          }
          childTLink.status = linkStatus;
          childTLink.type = 1;
          childTLink.leftnode = leftNode;
          childTLink.leftnode.links.push(childTLink);
          childTLink.rightnode = rightNode;
          childTLink.rightnode.links.push(childTLink);
          if (tnode.expanded) {
            childTLink.visible = true;
          } else {
            childTLink.visible = false;
          }
          if (0 == childTLink.status) {
            childTLink.strokecolor = "58,131,165";
          } else if (1 == childTLink.status) {
            childTLink.strokecolor = "220,20,60";
          } else if (2 == childTLink.status) {
            childTLink.strokecolor = "220,20,60";
          }
          childTLink.painted = false;
        }
      } else {
        // 物理拓扑链路添加。
        var leftNode = tnode.findTNodeById(leftNodeId);
        var rightNode = tnode.findTNodeById(rightNodeId);
        if (null == leftNode || null == rightNode) {
          console.log('添加的链路两端网元至少有一个不存在...');
          return false;
        } else {
          var childTLink = new WafTLink();
          childTLink.style = config.link;
          childTLink.id = linkId;
          childTLink.name = linkName;
          if (lineshowname) {
            childTLink.showname = linkName;
          }
          childTLink.status = linkStatus;
          childTLink.type = 1;
          childTLink.leftnode = leftNode;
          childTLink.rightnode = rightNode;
          if (false == multiLink) {
            // 遍历看下childTLink.leftnode.links中之前是否已存在了该条光纤。
            var occurtime = 0;
            for (var k = 0; k < childTLink.leftnode.links.length; k++) {
              var lnode = childTLink.leftnode.links[k].leftnode;
              var rnode = childTLink.leftnode.links[k].rightnode;
              if ((lnode == childTLink.leftnode && rnode == childTLink.rightnode)
                || (lnode == childTLink.rightnode && rnode == childTLink.leftnode)) {
                occurtime++;
              }
            }
            childTLink.curveLatLng = null;
            if (occurtime == 0) {
              childTLink.leftnode.links.push(childTLink);
              childTLink.rightnode.links.push(childTLink);
            } else {
              childTLink.curveLatLng = {latitude:null, longitude:null};
              var leftLat = Number(childTLink.leftnode.centerLatLng.latitude);
              var leftLng = Number(childTLink.leftnode.centerLatLng.longitude);
              var rightLat = Number(childTLink.rightnode.centerLatLng.latitude);
              var rightLng = Number(childTLink.rightnode.centerLatLng.longitude);
              var latGap = leftLat >= rightLat ? (leftLat - rightLat) : (rightLat - leftLat);
              var lngGap = leftLng >= rightLng ? (leftLng - rightLng) : (rightLng - leftLng);
              if (0 == latGap) {
                childTLink.curveLatLng = {latitude:leftLat, longitude:(leftLng + rightLng) / 2};
              } else if (latGap <= lngGap) {
                childTLink.curveLatLng = {latitude:(leftLat + rightLat) / 2, longitude:(leftLng + rightLng) / 2 + 0.5 * lngGap * occurtime / this.maxMuitiLinkNum};
              } else {
                childTLink.curveLatLng = {latitude:(leftLat + rightLat) / 2 + 0.5 * latGap * occurtime / this.maxMuitiLinkNum, longitude:(leftLng + rightLng) / 2};
              }
              if (0 == lngGap) {
                childTLink.curveLatLng = {latitude:(leftLat + rightLat) / 2, longitude:leftLng};
              } else if (latGap >= lngGap) {
                childTLink.curveLatLng = {latitude:(leftLat + rightLat) / 2 + 0.5 * latGap * occurtime/ this.maxMuitiLinkNum, longitude:(leftLng + rightLng) / 2};
              } else {
                childTLink.curveLatLng = {latitude:(leftLat + rightLat) / 2, longitude:(leftLng + rightLng) / 2 + 0.5 * lngGap * occurtime / this.maxMuitiLinkNum};
              }
              childTLink.leftnode.links.push(childTLink);
              childTLink.rightnode.links.push(childTLink);
            }
          } else {
            childTLink.leftnode.links.push(childTLink);
            childTLink.rightnode.links.push(childTLink);
          }
          if (tnode.expanded) {
            childTLink.visible = true;
          } else {
            childTLink.visible = false;
          }
          if (0 == childTLink.status) {
            childTLink.strokecolor = "58,131,165";
          } else if (1 == childTLink.status) {
            childTLink.strokecolor = "220,20,60";
          } else if (2 == childTLink.status) {
            childTLink.strokecolor = "220,20,60";
          }
          childTLink.painted = false;
          // 判断是否需要设置linklabel
          if (false == linkHasLabel) {
            var linkLabel = new WafTLabel();
            if (lineshowname) {
              linkLabel.visible = true;
            }
            linkLabel.style = config.label;
            linkLabel.name = childTLink.name;
            linkLabel.showname = childTLink.name;
            linkLabel.centerLatLng = {latitude: null, longitude: null};
            if (null == childTLink.curveLatLng) {
              var leftnodecoordinate = childTLink.leftnode.coordinate;
              var rightnodecoordinate = childTLink.rightnode.coordinate;
              var leftnodecenterLatLng = childTLink.leftnode.centerLatLng;
              var rightnodecenterLatLng = childTLink.rightnode.centerLatLng;
              linkLabel.coordinate = {
                x: Number(leftnodecoordinate.x) + Number(rightnodecoordinate.x) / 2,
                y: Number(leftnodecoordinate.y) + Number(rightnodecoordinate.y) / 2
              };
              var linlLat = (Number(leftnodecenterLatLng.latitude) + Number(rightnodecenterLatLng.latitude)) / 2;
              var linkLng = (Number(leftnodecenterLatLng.longitude) + Number(rightnodecenterLatLng.longitude)) / 2;
              linkLabel.centerLatLng.latitude = linlLat;
              linkLabel.centerLatLng.longitude = linkLng;
            } else {
              var curveLatLng = childTLink.curveLatLng;
              var linlLat = Number(curveLatLng.latitude);
              var linkLng = Number(curveLatLng.longitude);
              linkLabel.centerLatLng.latitude = linlLat;
              linkLabel.centerLatLng.longitude = linkLng;
            }
            childTLink.tlabel = linkLabel;
          }
        }
      }
    } else if (4 == type) {
      // 链路删除
      var deletedLinkId = msg.links[0].id;
      var physicaltopo = config.map.physicaltopo;
      if (!physicaltopo) {
        // 逻辑拓扑删除链路
        if (tnode.childList && null != tnode.childList) {
          var findLink = false;
          for (var i = 0; i < tnode.childList.length; i++) {
            var links = tnode.childList[i].links;
            for (var j = 0; j < links.length; j++) {
              if (links[j].id == deletedLinkId) {
                console.log('已找到待删除的链路,id = ', deletedLinkId);
                findLink = true;
                break;
              }
            }
          }
          if (findLink == false) {
            console.log('没有发现待删除的链路,id = ', deletedLinkId);
            return false;
          }
        }
      } else {
        // 物理拓扑删除链路
        if (tnode.childList && null != tnode.childList) {
          var findLink = false;
          for (var i = 0; i < tnode.childList.length; i++) {
            var links = tnode.childList[i].links;
            for (var j = 0; j < links.length; j++) {
              if (links[j].id == deletedLinkId) {
                console.log('已找到待删除的链路,id = ', deletedLinkId);
                findLink = true;
                break;
              }
            }
          }
          if (findLink == false) {
            console.log('没有发现待删除的链路,id = ', deletedLinkId);
            return false;
          }
        }
      }
    } else if (5 == type) {
      // 链路更新
      var updateId = msg.links[0].id;
      var newstatus = msg.links[0].status;
      var physicaltopo = config.map.physicaltopo;
      if (!physicaltopo) {
        // 逻辑拓扑链路更新
        if (tnode.childList && null != tnode.childList) {
          var findLink = false;
          for (var i = 0; i < tnode.childList.length; i++) {
            var links = tnode.childList[i].links;
            for (var j = 0; j < links.length; j++) {
              if (links[j].id == updateId) {
                console.log('已找到待更新的链路,id = ', updateId);
                links[j].status = newstatus;
                if (0 == newstatus) {
                  links[j].strokecolor = "58,131,165";
                } else if (1 == newstatus) {
                  links[j].strokecolor = "220,20,60";
                } else if (2 == newstatus) {
                  links[j].strokecolor = "220,20,60";
                }
                findLink = true;
                break;
              }
            }
          }
          if (findLink == false) {
            console.log('没有发现待更新的链路,id = ', updateId);
            return false;
          }
        }
      } else {
        // 物理拓扑链路更新
        if (tnode.childList && null != tnode.childList) {
          var findLink = false;
          for (var i = 0; i < tnode.childList.length; i++) {
            var links = tnode.childList[i].links;
            for (var j = 0; j < links.length; j++) {
              if (links[j].id == updateId) {
                console.log('已找到待更新的链路,id = ', updateId);
                links[j].status = newstatus;
                if (0 == newstatus) {
                  links[j].strokecolor = "58,131,165";
                } else if (1 == newstatus) {
                  links[j].strokecolor = "220,20,60";
                } else if (2 == newstatus) {
                  links[j].strokecolor = "220,20,60";
                }
                findLink = true;
                break;
              }
            }
          }
          if (findLink == false) {
            console.log('没有发现待更新的链路,id = ', updateId);
            return false;
          }
        }
      }
    }
    return true;
  }*/
}
