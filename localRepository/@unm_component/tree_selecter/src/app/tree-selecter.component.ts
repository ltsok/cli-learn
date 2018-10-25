import { Component, Input, OnInit, Output, ViewChild, ViewChildren, ViewContainerRef, ComponentFactoryResolver, EventEmitter, TemplateRef } from '@angular/core';
import { NzTreeComponent, NzTreeNode } from 'ng-zorro-antd';
import { DataSource } from "./model/tree-selecter.model";

/**
 * 树选择组件
 * 设计思路：存在多树切换的时候，使用ngfor遍历各个树的数据，然后使用ngif来确认显示哪一棵树；针对每个树，单独保存已选的节点列表
 *
 * 使用示例
 * <tree-selecter #objectsTree [data]="data" [(checkedList)]="myChecked" [isCheckStrictly]="true"
      [isShowLabel]="true" [searchLabel]="'选择对象'" [isCustomView]="true"
      [customContent]="myTpl"></tree-selecter>
  <ng-template #myTpl>
    <p>asdf</p>
    <b>nihao </b>
    <input type="text" nz-input [placeholder]="'请输入关键字'" [(ngModel)]="myValue">
  </ng-template>

  @ViewChild("objectsTree") objectsTreeRef: TreeSelecterComponent;
  this.objectsTreeRef.clearAll();
 *
 * 参数解释
 * @Input() data: DataSource[]，接收树数据，自动根据数组长度显示隐藏切换器，内部格式：{ label: "对象", data: NzTreeNode[] }[]
 * [(checkedList)]: NzTreeNode[] = []，已选节点，双向绑定。目前多树情况下只暴露了当前树的已选节点。
 * @Input() isCheckStrictly: boolean = true，父子节点严格模式，默认true，勾选父节点时子节点不会自动全选
 * @Input() isCustomView: boolean = false，与customContent配合使用，增加一个“自定义”的切换器，自定义内容
 * @Input() searchValue: string = ""，搜索内容，可以设置默认过滤的内容
 * @Input() isShowLabel = true;   搜索框前面的label是否显示
 * @Input() searchLabel = "网元对象";   搜索框前面的label自定义字符串
 * @Input() treeBoxStyle: object = { height: "350px" };  树容器div的样式
 *
 * 方法解释
 * getCheckedList(label?: string):NzTreeNode[],获取当前树的已选节点，可以指定树label获取对应已选节点
 * clearAll():void，清空所有树的已选节点
 * clearChecked(label?: string): void，清空已选节点，可以使用树label来指定要操作的树，默认当前树
 *
 * @export
 * @class Tree_selecterComponent
 */
@Component({
  selector: 'tree-selecter',
  templateUrl: './tree-selecter.component.html',
  styleUrls: ['./tree-selecter.component.scss']
})
export class TreeSelecterComponent implements OnInit {
  /** 使用setter方法，确保树切换的时候能够仍然获取到当前显示的树实例 */
  private treeRef: NzTreeComponent;
  @ViewChild(NzTreeComponent) set tree(tree: NzTreeComponent) {
    this.treeRef = tree;
  }
  /** 是否显示搜索label */
  @Input() isShowLabel = true;
  /** 搜索label内容 */
  @Input() searchLabel = "网元对象";
  /** 是否显示树边框 */
  @Input() isShowTreeBorder: boolean = true;
  @Input() treeBoxStyle: object = { height: "350px" };

  _treeBoxStyle: object = { border: "solid 1px #dddddd" };
  /** 搜索关键字 */
  @Input() searchValue: string = "";
  /** 可选框 */
  @Input() checkable: boolean = true;
  /** 父子选中是否关联 */
  @Input() isCheckStrictly: boolean = true;
  /** 树源数据 */
  @Input() data: DataSource[];
  /** 选中数据，双向绑定，保存当前树的已选节点 */
  @Input() checkedList: NzTreeNode[] = [];
  @Output() checkedListChange: EventEmitter<any> = new EventEmitter();
  /** 是否显示树视图切换器 */
  isShowTaber: boolean = false;
  /** 树切换是否显示自定义视图选项 */
  @Input() isCustomView: boolean = false;
  /** 内容区是否显示自定义块 */
  isCustomed = false;
  /** 自定义块内容 */
  _custom = 'custom View';
  _customTpl: TemplateRef<void>;
  @Input()
  set customContent(value: string | TemplateRef<void>) {
    if (value instanceof TemplateRef) {
      this._custom = null;
      this._customTpl = value;
    } else {
      this._custom = value;
    }
  }
  /** 多个树情况，选中树类型 */
  treeIndex = 0;
  fromIndex = 0;
  /** 多个树情况，树切换列表 */
  treeIndexs = [];
  /** 是否显示已选 */
  isShowChecked: boolean = false;

  /**
   * 鼠标操作响应
   *
   * @param {string} name
   * @param {*} e 鼠标事件
   * @memberof TreeSelecterComponent
   */
  private mouseAction(name: string, e: any): void {
    // console.log(name, e);

  }

  /**
   * 勾选响应
   *
   * @param {*} e 勾选事件
   * @param {any} treeIndex 当前操作的树序号
   * @memberof TreeSelecterComponent
   */
  private onCheckChange(e: any, treeIndex: any) {

    this.data[this.treeIndex].checkedNodes = [...this.treeRef.getCheckedNodeList()];
    this.checkedList = [...this.data[this.treeIndex].checkedNodes];
    this.checkedListChange.emit(this.checkedList);
  }

  /**
   * 单选切换树内容
   *
   * @param {*} e
   * @memberof TreeSelecterComponent
   */
  private treeIndexChange(e: any, ) {
    console.log(e);
    this.isCustomed = false;
    if (this.treeIndexs[e].label === "自定义") {
      // this.treeTpl.clear();
      this.isCustomed = true;
      return;
    }
    /** 赋值已选 */
    this.checkedList = [...this.data[e].checkedNodes];
    this.checkedListChange.emit(this.checkedList);
  }

  /**
   * 切换显示已选树
   *
   * @memberof TreeSelecterComponent
   */
  private toggleTreeChecked() {
    this.isShowChecked = !this.isShowChecked;
  }

  /**
   * 获取已选节点列表，允许按照树label获取指定树，默认当前树
   *
   * @param {string} [label] 树对应的label值
   * @returns 对应树的已选节点列表
   * @memberof TreeSelecterComponent
   */
  getCheckedList(label?: string): NzTreeNode[] {
    let arr = [];
    if (label) {
      for (let index = 0; index < this.data.length; index++) {
        const element = this.data[index];
        if (element.label === label) {
          arr = element.checkedNodes;
        }
      }
    } else {
      arr = this.treeRef.getCheckedNodeList();
    }
    return arr;
  }

  /**
   * 清空所有树的已选节点
   *
   * @memberof TreeSelecterComponent
   */
  clearAll(): void {
    for (let index = 0; index < this.data.length; index++) {
      const element = this.data[index];
      element.checkedNodes = [];
      this.clear(index).then(() => {
        this.checkedList = [...this.treeRef.getCheckedNodeList()];
        this.checkedListChange.emit(this.checkedList);
      }).catch();

    }
  }
  /**
   * 清空已选节点，可以使用树label来指定要操作的树，默认当前树
   *
   * @param {string} [label] 树label
   * @memberof TreeSelecterComponent
   */
  clearChecked(label?: string): void {
    let treeIndex = this.treeIndex;
    if (label) {
      for (let index = 0; index < this.data.length; index++) {
        const element = this.data[index];
        if (element.label === label) {
          // 匹配到对应label的树序号
          treeIndex = index;
          this.clear(treeIndex).then(() => {
            this.checkedList = [...this.treeRef.getCheckedNodeList()];
            this.checkedListChange.emit(this.checkedList);
          }).catch();
        }
      }
    } else {
      this.clear(treeIndex).then(() => {
        this.checkedList = [...this.treeRef.getCheckedNodeList()];
        this.checkedListChange.emit(this.checkedList);
      }).catch();
    }

  }
  private clear(treeIndex) {
    this.data[treeIndex].checkedNodes = [];
    for (let index = 0; index < this.data[treeIndex].data.length; index++) {
      /** 清除所有的selected、checked状态 */
      this.data[treeIndex].data[index].isAllChecked = false;
      this.data[treeIndex].data[index].isChecked = false;
      this.data[treeIndex].data[index].isHalfChecked = false;
      this.data[treeIndex].data[index].isSelected = false;
      // this.data[treeIndex].data[index].isExpanded = false;
      this.updateNode(this.data[treeIndex].data[index]);
    }
    return new Promise((resolve, reject) => { resolve(); });
  }

  private updateNode(node) {
    this.treeRef.nzTreeService.checkTreeNode(node);
    // 清空逻辑不区分严格模式还是非严格模式
    this.treeRef.nzTreeService.setCheckedNodeList(node);
    // if (this.isCheckStrictly) {
    //   this.treeRef.nzTreeService.setCheckedNodeListStrict(node);
    // } else {
    //   this.treeRef.nzTreeService.setCheckedNodeList(node);
    // }
  }

  constructor() {
  }

  ngOnChanges(changes): void {
    // 获取data值之后初始化数据
    if (changes.hasOwnProperty("data") && changes["data"].currentValue != null) {
      /** 初始化数据 */
      this.data[0].checkedNodes = [];
      this.treeIndexs.push({ label: this.data[0].label, value: 0 });
      /** 多选初始化切换控件 */
      if (this.data.length > 1) {
        for (let index = 1; index < this.data.length; index++) {
          this.data[index].checkedNodes = [];
          let item = { label: "", value: 0 };
          item.label = this.data[index].label;
          item.value = index;
          this.treeIndexs.push(item);
        }
      }
      /** 增加自定义视图切换 */
      if (this.isCustomView) {
        this.treeIndexs.push({ label: "自定义", value: this.data.length });
      }
      /** 显示视图切换器 */
      if (this.treeIndexs.length > 1) {
        this.isShowTaber = true;
      }
    }
  }

  /**
   * 初始化操作
   *
   * @memberof TreeSelecterComponent
   */
  ngOnInit(): void {
    /** 边框样式 */
    if (!this.isShowTreeBorder) {
      this._treeBoxStyle = { border: "none" };
    }
    this._treeBoxStyle = Object.assign(this._treeBoxStyle, this.treeBoxStyle);
  }

  ngAfterViewInit(): void {
  }
}
