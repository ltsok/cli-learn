import { Component, Renderer2, ViewChild, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { constant } from '../unm-topo.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { TpiGlobalService } from "@waf_service/tpi";
import { HttpService, RequestMsg } from "@waf_service/http";
import { NzTreeNode, NzFormatEmitEvent, NzTreeNodeOptions, NzTreeComponent } from 'ng-zorro-antd';
import { WafIconComponent } from "@unm_component/waf_icon/src/app/waf-icon.component";
/**
 * topo-objtree
 * @export
 * @class TopoObjTreeComponent
 */
@Component({
  selector: 'topo-tree',
  templateUrl: './topo-objtree.component.html',
  styleUrls: ['./topo-objtree.component.scss']
})
export class TopoObjTreeComponent implements OnChanges {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {ContextService} context
   * @memberof TopoObjTreeComponent
   */
  constructor(private logger: LoggerService, private context: ContextService, private http: HttpService, private tpi: TpiGlobalService, private ren: Renderer2) {
    this.searchObject = new SearchObject();
    this.searchObject.name = true;
    this.searchObject.ip = true;
    this.searchObject.type = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('数据变更！');
    console.log(changes);
  }
  searchObject: SearchObject;
  /**
   * 全局搜索的关键字字段
   */
  keyword: string;
  /**
   * 下拉框的初始数据源
   */
  dataProvider = [];
  /**
   * 关键字检索后的数据源
   */
  filterDatas = [];
  /**
   * 树的节点列表
   */
  nodes = [];

  /**
   * 记录每一次值改变是输入框的值
   */
  inputValue: string;

  selectId: string;
  isShowClear: boolean = false;
  rootId = -1;
  @Input() set topoSelect(value: string) {
    this.searchExpand(value);
  }
  @Input() set dataSource(value: any) {
    if (value) {
      this.rootId = value.id;
    }
    this.packNodes(value);
  }
  @Input() set dataChange(value: Array<any>) {
    if (!this.nodes) {
      return;
    }
    if (value && value.length > 0) {
      value.forEach((item) => {
        this.filterNodes(item);
      });
    }
  }
  @Input() set alarmChange(value: Array<any>) {
    if (!value || value.length === 0) return;
    value.forEach((item) => {
      this.updateAlarmState(this.nodes, item);
    });
    console.log('告警上报数据更新完成');
  }
  @Output() selectClick = new EventEmitter();

  /**
   * 更新对象树的告警状态
   * @param nodes 
   * @param data 
   */
  updateAlarmState(nodes: Array<any>, data: any) {
    if (!nodes || nodes.length === 0) return;
    let flag: boolean = false;
    for (let i = 0; i < nodes.length; i++) {
      let node: NzTreeNode = nodes[i];
      if (node.key === data.id + '') {//找到对应节点更新告警状态
        flag = true;
        let nodeOption: NzTreeNodeOptions = node.origin;
        if (nodeOption.icons) {
          nodeOption.icons.aroundIcons = this.getAroudIcons(data.icon);
        }
        nodeOption.borderColor = data.icon.borderColor ? data.icon.borderColor : ''
        return;
      }
      this.updateAlarmState(node.getChildren(), data);
    }
    if (flag) return;
  }

  /**
   * 过滤推送的数据的增删改
   */
  filterNodes(item: any) {
    this.dropDownBoxDataChange(item);
    this.loopFilterNode(item);

    console.log('推送后的对象树数据');
    console.log(this.nodes);
  }

  /**
   * 根据推送数据来操作下拉框数据的增删改
   * @param item 传过来的单条数据
   */
  dropDownBoxDataChange(item: any) {
    if (item.object.operType === 'CREATE') {
      this.dataProvider.push({
        label: item.type === 'NE' ? item.object.name : item.object.domainName,
        value: item.type === 'NE' ? item.object.name : item.object.domainName,
        id: item.object.oid,
        ip: item.type === 'NE' ? item.object.ip : '',
        type: item.type,
        neTypeName: item.type === 'NE' ? item.neTypeName : ''
      });
    } else {
      this.dataProvider.forEach((op, i) => {
        if (op.id === item.object.objId + '') {
          if (item.object.operType === 'UPDATE') {
            op.label = item.type === 'NE' ? item.object.name : item.object.domainName;
            op.value = item.type === 'NE' ? item.object.name : item.object.domainName;
            op.ip = item.type === 'NE' ? item.object.ip : '';
            op.neTypeName = item.type === 'NE' ? item.neTypeName : ''
          } else if (item.object.operType === 'DELETE') {
            this.dataProvider.splice(i, 1);
          }
        }
      });
    }
  }

  /**
   * 循环递归更新上报推送的数据
   * @param data 推送的数据
   */
  loopFilterNode(data: any) {
    if (!data || this.nodes.length === 0) return;
    if ('UPDATE' === data.object.operType) {//当数据为更新状态时
      const loopUpdate = (nodes: NzTreeNode[], data: any) => {
        if (!nodes || nodes.length === 0) return;
        for (let i = 0; i < nodes.length; i++) {
          let node: NzTreeNode = nodes[i];
          if (node.key === data.object.objId + '') {
            node.title = data.type === 'NE' ? data.object.name : data.object.domainName;
            node.origin.ip = data.object.ip;
            break;
          }
          loopUpdate(node.getChildren(), data);
        }
      }
      loopUpdate(this.nodes, data);
    } else {
      //操作新增数据时的方法
      const loopAdd = (nodes: NzTreeNode[], data: any) => {
        if (!nodes || nodes.length === 0) return;
        let flag = false;
        let arr = [];
        arr.push(new NzTreeNode({
          key: data.object.oid,
          title: data.type === 'NE' ? data.object.name : data.object.domainName,
          children: null,
          isLeaf: true,
          ip: data.object.ip,
          mainIcon: 'fh-yuanjian',
          type: data.type,
          icons: { mainSize: 16, aroundSize: 8, aroundIcons: this.getAroudIcons(null) },
          borderColor: ''
        }));
        if (data.object.parentId === 3) {
          nodes.push(arr[0]);
          return;
        }
        for (let i = 0; i < nodes.length; i++) {
          let node: NzTreeNode = nodes[i];
          if (node.key === data.object.parentId + '') {
            flag = true;
            node.isLeaf = false;
            node.addChildren(arr);
            break;
          }
          loopAdd(node.getChildren(), data);
        }
        if (flag) {
          return;
        }
      }
      //操作删除数据时

      const loopDelete = (parentNode: NzTreeNode, data: any, isFirstLevel: boolean) => {
        if (!isFirstLevel) {
          if (!parentNode) return;
        }
        let nodeChildren: NzTreeNode[] = isFirstLevel ? this.nodes : parentNode.getChildren();
        let index: number = -1;
        let children = [];
        for (let i = 0; i < nodeChildren.length; i++) {
          let n: NzTreeNode = nodeChildren[i];
          let nodeId = data.object.objId || data.object.domainId
          if (n.key === nodeId + '') {
            index = i;
            if (!isFirstLevel) {
              parentNode.addChildren(n.getChildren());
            } else {
              children = n.getChildren();
            }
            break;
          }
          loopDelete(n, data, false);
        }
        if (index > -1) {
          nodeChildren.splice(index, 1);
          if (isFirstLevel) {
            nodeChildren = nodeChildren.concat(children);
            this.nodes = nodeChildren;
          } else {
            if (!parentNode.getChildren() || parentNode.getChildren().length === 0) {
              parentNode.isLeaf = true;
            }
          }
          return;
        }
      }


      if ('CREATE' === data.object.operType) {//当数据为新增状态时
        loopAdd(this.nodes, data);
      } else if ('DELETE' === data.object.operType) {//当数据为删除状态时
        loopDelete(null, data, true);
      }
    }
    console.log("对象树推送数据处理完成！");
  }


  /**
   * 下拉框选中的事件
   */
  selectItem(value) {
    this.selectClick.emit(value);
    this.searchExpand(value);
  }

  /**
   * 下拉框中输入框的值改变事件
   * @param value
   */
  selectInputChange(value: string) {
    if (!value) {
      this.isShowClear = false;
    } else {
      this.isShowClear = true;
    }
    console.log('value:' + value);
    value = value ? value.toLowerCase() : '';
    this.filterDatas = [];
    for (let i = 0; i < this.dataProvider.length; i++) {
      let item: any = this.dataProvider[i];
      if (this.searchObject.name) {
        if (item.label && item.label.toLowerCase().indexOf(value) > -1) {
          this.filterDatas.push(item);
          continue;
        }
      }
      if (item.type != 'NE') {
        continue;
      }
      if (this.searchObject.ip) {
        if (item.ip && item.ip.indexOf(value) > -1) {
          this.filterDatas.push(item);
          continue;
        }
      }
      if (this.searchObject.type) {
        if (item.neTypeName && item.neTypeName.toLowerCase().indexOf(value) > -1) {
          this.filterDatas.push(item);
        }
      }
    }
    if (this.filterDatas.length === 0) {
      this.filterDatas.push({ label: '', value: '', id: '-1' });
    }
  }
  /**
   * 根据下拉框选中的值进行定位选中并展开
   * @param value 下拉框选中的值
   */
  searchExpand(value: string): void {
    if (!value || value === '-1') {
      return;
    }
    const loopParent = (node: NzTreeNode) => {
      // expand parent node
      if (node.getParentNode()) {
        node.getParentNode().isExpanded = true;
        loopParent(node.getParentNode());
      }
    };
    const loopChild = (node: NzTreeNode) => {
      if (value && node.key === value) {
        loopParent(node);
        if (node.children) {
          node.isExpanded = false;
        }
        node.isSelected = true;
      } else {
        node.isExpanded = false;
        node.isSelected = false;
      }
      node.children.forEach(cNode => {
        loopChild(cNode);
      });
    };
    this.nodes.forEach((node: NzTreeNode) => {
      loopChild(node);
    });
  }

  /**
   * 组装对象树的数据方法
   * @param data 
   */
  packNodes(data: any) {
    if (!data) {
      return;
    }
    this.nodes = [];
    this.dataProvider = [];
    Array.from(data.children).forEach((item: any) => {
      let url = item.type == 'NE' ? '../../assets/unm_topo/ne.png' : '../../assets/unm_topo/doman.png';
      this.nodes.push(new NzTreeNode({
        title: item.id === 0 ? '本机网管' : item.name,
        key: item.id + '',
        children: this.packItem(item.children),
        isLeaf: item.children && item.children.length > 0 ? false : true,
        ip: item.ip,
        mainIcon: 'fh-yuanjian',
        type: item.type,
        icons: { mainSize: 16, aroundSize: 8, aroundIcons: this.getAroudIcons(item.iconRule) },
        borderColor: item.iconRule ? item.iconRule.borderColor : null
      }));
      this.dataProvider.push({ label: item.name, value: item.name, id: item.id + "", ip: item.ip || '', type: item.type, neTypeName: item.neTypeName, url: url })
    })
    this.filterDatas = this.dataProvider;
    console.log(this.nodes);
  }

  packItem(children: Array<any>): Array<NzTreeNodeOptions> {
    if (!children || children.length === 0) {
      return null;
    }
    let arr: Array<NzTreeNodeOptions> = new Array<NzTreeNodeOptions>();
    children.forEach((item: any) => {
      let url = item.type == 'NE' ? '../../assets/unm_topo/ne.png' : '../../assets/unm_topo/doman.png';
      arr.push({
        key: item.id + '',
        title: item.name,
        children: this.packItem(item.children),
        isLeaf: item.children && item.children.length > 0 ? false : true,
        ip: item.ip,
        mainIcon: 'fh-yuanjian',
        type: item.type,
        icons: { mainSize: 16, aroundSize: 8, aroundIcons: this.getAroudIcons(item.iconRule) },
        borderColor: item.iconRule.borderColor ? item.iconRule.borderColor : ''
      });
      this.dataProvider.push({ label: item.name, value: item.name, id: item.id + "", ip: item.ip || '', type: item.type, neTypeName: item.neTypeName, url: url })
    });
    return arr;
  }

  /**
   * 节点的单击事件
   */
  nodeClick(data: NzFormatEmitEvent) {
    this.selectClick.emit({ nodeId: data.node.key, type: data.node.origin.type });
  }

  /**
   * 监听清除按钮的事件
   */
  clearInput() {
    this.keyword = null;
    this.isShowClear = false;
    this.selectInputChange(null);
  }

  /**
   * 输入框获取焦点的事件
   */
  focusInput() {
    if (this.keyword) {
      this.isShowClear = true;
    } else {
      this.isShowClear = false;
    }
    this.selectInputChange(this.keyword);
  }

  getAroudIcons(icons: any) {
    let arr = []
    if (!icons) {
      arr.push({ site: 'rightBottom', class: 'fh-tuopuwangyuanweipeizhi', color: 'blue' });
      return arr;
    }
    if (icons.maIcon) {
      if (icons.maIcon.iconName.indexOf('ma') > -1) {
        arr.push({ site: 'rightBottom', class: 'fh-tuopuG', color: 'blue' });
      } else if (icons.maIcon.iconName.indexOf('gne') > -1) {
        arr.push({ site: 'rightBottom', class: 'fh-tuopuG', color: 'blue' });
      }
    } else {
      arr.push({ site: 'rightBottom', class: 'fh-tuopuwangyuanweipeizhi', color: 'blue' });
    }
    if (icons.specialIcon) {
      if (icons.specialIcon.iconName.indexOf('special14') > -1) {
        arr.push({ site: 'rightTop', class: 'fh-tuopuwangyuanzhongduan', color: 'red' });
      } else if (icons.specialIcon.iconName.indexOf('special15') > -1) {
        arr.push({ site: 'rightTop', class: 'fh-qujihuo', color: 'red' });
      }
    } else {
      arr.push({ site: 'rightTop', class: 'fh-tuopuwangyuanweipeizhi', color: 'red' });
    }
    return arr;
  }
}

class SearchObject {
  name: boolean;
  ip: boolean;
  type: boolean;
}
