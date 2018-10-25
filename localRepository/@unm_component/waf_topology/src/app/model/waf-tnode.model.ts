import {WafTLink} from '../model/waf-tlink.model';
import {WafTRange} from '../model/waf-trange.model';
import {WafTLabel} from '../model/waf-tlabel.model';
import {WafTNodeIcon} from '../model/waf-tnodeicon.model';

export class WafTNode {
  id:string;
  name:string;
  showname:string;
  ip:string;
  centerLatLng:any;
  oldCoordinate:any;
  // {x:...,y:...}
  coordinate:any;
  // 0:logic;1:ne;2:frame;3:board;4:port
  type:number;
  status:number;
  childList:Array<WafTNode>;
  iconChildList:Array<WafTNodeIcon>;
  expanded:boolean;
  parent:WafTNode;
  // 从最外层开始算起，第一层为0，后续分别为1,2,...,n
  level:number;
  links:Array<WafTLink>;
  style:any;
  showimgsrc:string;
  imgsrc:string;
  imgstyle:any;
  realnode:any;
  trange:WafTRange;
  tlabel:WafTLabel;
  public visible:boolean;
  public painted:boolean = false;
  deleted:boolean = false;
  params:any;
  getLinksByType(pType:number):Array<WafTLink> {
    var result = [];
    if (this.links) {
      for (var i = 0; i < this.links.length; i++) {
        if (this.links[i].type == pType) {
          result.push(this.links[i]);
        }
      }
      return result;
    }
    return null;
  }

  isRoot():boolean {
    if (null == this.parent && 0 == this.type) {
      return true;
    } else {
      return false;
    }
  }

  isLeaf():boolean {
    if ((null == this.childList || 0 == this.childList.length) && 1 == this.type) {
      return true;
    } else {
      return false;
    }
  }

  isGroup():boolean {
    return null != this.trange;
  }

  isSc():boolean {
    if (null == this.childList && this.childList.length > 0 && 1 == this.type && 1 == this.childList[0].type) {
      return true;
    } else {
      return false;
    }
  }

  isDc():boolean {
    if (null == this.childList && this.childList.length > 0 && 1 == this.type && 0 == this.childList[0].type) {
      return true;
    } else {
      return false;
    }
  }

  isExpanded():boolean {
    return this.expanded;
  }

  isVisible():boolean {
    return this.visible;
  }

  isPainted():boolean {
    return this.painted;
  }

  findTNodeById(id: string) {
    if (this.childList && null != this.childList) {
      for (var i = 0; i < this.childList.length; i++) {
        if (this.childList[i].id == id) {
          return this.childList[i];
        }
      }
    }
    return null;
  }

  findTLinkById(wafTNode:WafTNode, id: string) {
    if (null != wafTNode) {
      var links = wafTNode.links;
      if (null != links) {
        for (var j = 0; j < links.length; j++) {
          if (links[j].id == id) {
            return links[j];
          }
        }
      }
      if (null != wafTNode.childList) {
        for (var i = 0; i < wafTNode.childList.length; i++) {
          // 递归遍历
          if (wafTNode.childList[i].type != 1) {
            var link = this.findTLinkById(wafTNode.childList[i], id);
            if (null != link) {
              return link;
            }
          } else {
            var links = wafTNode.childList[i].links;
            if (null != links) {
              for (var k = 0; k < links.length; k++) {
                if (links[k].id == id) {
                  return links[k];
                }
              }
            }
          }
        }
        return null;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  removeChildTNodeById(id: string) {
    if (this.childList && null != this.childList) {
      for (var i = 0; i < this.childList.length; i++) {
        if (this.childList[i].id == id) {
          this.childList.splice(i, 1);
          i--;
        }
      }
    }
  }

  removeTLinkById(id: string) {
    if (this.links && null != this.links) {
      for (var i = 0; i < this.links.length; i++) {
        if (this.links[i].id == id) {
          this.links.splice(i, 1);
          i--;
        }
      }
    }
  }

  addTLink(link:WafTLink) {
    if (this.links == null) {
      this.links = new Array<WafTLink>();
    }
    this.links.push(link);
  }

  constainsIcon(position:number) {
    if (null != this.iconChildList) {
      for (var i = 0; i < this.iconChildList.length; i++) {
        var params = this.iconChildList[i].params;
        if (null != params && params['position'] == position) {
          return true;
        }
      }
    }
    return false;
  }

  getIcon(position:number) {
    if (null != this.iconChildList) {
      for (var i = 0; i < this.iconChildList.length; i++) {
        var params = this.iconChildList[i].params;
        if (null != params && params['position'] == position) {
          return this.iconChildList[i];
        }
      }
    }
    return null;
  }

  removeIcon(position:number) {
    if (null != this.iconChildList) {
      for (var i = 0; i < this.iconChildList.length; i++) {
        var params = this.iconChildList[i].params;
        if (null != params && params['position'] == position) {
          this.iconChildList.splice(i, 1);
          break;
        }
      }
    }
  }

  addOrUpdateIcon(position:number, imgSrc:string) {
    if (null == this.iconChildList) {
      this.iconChildList = new Array<WafTNodeIcon>();
    }
    if (null == imgSrc) {
      // 删除
      var iconNode = this.getIcon(position);
      if (null != iconNode) {
        iconNode.deleted = true;
      }
    } else {
      if (this.constainsIcon(position)) {
        // 修改
        var iconNode = this.getIcon(position);
        iconNode.imgsrc = imgSrc;
        iconNode.showimgsrc = imgSrc;
      } else {
        // 添加
        var wafTNodeIcon = new WafTNodeIcon();
        wafTNodeIcon.imgsrc = imgSrc;
        wafTNodeIcon.showimgsrc = imgSrc;
        wafTNodeIcon.params = {position:position};
        wafTNodeIcon.parent = this;
        this.iconChildList.push(wafTNodeIcon);
      }
    }
  }

  /**
   *
   * @param {WafTNode} tnode
   * @param {string} id
   */
  getPositionById(tnode:WafTNode, theNode:WafTNode) {
    if (null != theNode && null != tnode) {
      // 同一层
      if (tnode.parent == theNode.parent) {
        return 0;
      }
      var theNodeParents = this.getParents(theNode);
      if (null != theNodeParents) {
        for (var i = 0; i < theNodeParents.length; i++) {
          if (theNodeParents[i] == tnode) {
            return -1;
          }
        }
      }
      return 1;
    }
    return null;
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

  getTopWafTNode(curNode:WafTNode) {
    var curTopoNode = curNode;
    // 获取顶层域节点
    var preTopoNode = null;
    while (null != curTopoNode) {
      preTopoNode = curTopoNode;
      curTopoNode = curTopoNode.parent;
    }
    return preTopoNode;
  }

  judgeIfHasUpLink(curNode:WafTNode) {
    if (null != curNode && curNode.type == 1) {
      var topWafNode = this.getTopWafTNode(curNode);
      // 处理网元
      var exist = false;
      var logicNode = curNode.parent;
      while (null != logicNode && logicNode != topWafNode) {
        var logicLinks = logicNode.links;
        if (null != logicLinks) {
          for (var t = 0; t < logicLinks.length; t++) {
            var logicLeftNeNode = logicLinks[t].leftNeNode;
            var logicRightNeNode = logicLinks[t].rightNeNode;
            var logicLeftNode = logicLinks[t].leftnode;
            var logicRightNode = logicLinks[t].rightnode;
            if ((logicLeftNode == logicNode && logicLeftNeNode == curNode) || (logicRightNode == logicNode && logicRightNeNode == curNode)) {
              exist = true;
              break;
            }
          }
          if (exist) {
            break;
          }
        }
        logicNode = logicNode.parent;
      }
      return exist;
    } else if (null != curNode && curNode.type != 1) {
      var topWafNode = this.getTopWafTNode(curNode);
      // 处理逻辑域的向上连纤
      var exist = false;
      var pointer = curNode.parent;
      while (null != pointer && pointer != topWafNode) {
        var logicLinks = pointer.links;
        if (null != logicLinks) {
          for (var t = 0; t < logicLinks.length; t++) {
            var logicLeftNeNode = logicLinks[t].leftNeNode;
            var logicRightNeNode = logicLinks[t].rightNeNode;
            var leftNeNodePosition = logicLeftNeNode.getPositionById(curNode, logicLeftNeNode);
            var rightNeNodePosition = logicRightNeNode.getPositionById(curNode, logicRightNeNode);
            if (null != leftNeNodePosition && null != rightNeNodePosition && ((-1 == leftNeNodePosition && 1 == rightNeNodePosition) || (1 == leftNeNodePosition && -1 == rightNeNodePosition))) {
              exist = true;
              break;
            }
          }
          if (exist) {
            break;
          }
        }
        pointer = pointer.parent;
      }
      return exist;
    }
    return false;
  }
}


