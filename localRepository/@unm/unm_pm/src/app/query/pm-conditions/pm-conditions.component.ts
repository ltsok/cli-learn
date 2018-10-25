import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { constant } from '../../unm-pm.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";

import { GridComponent, GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { NzTreeNode } from 'ng-zorro-antd';

import { TreeSelecterComponent } from "@unm_component/tree_selecter/src/app/tree-selecter.component";
import { UnmPmService } from "../../service/unm-pm.service";
import { node, node1 } from "../../model/unm-pm.model";

/**
 * 性能查询表单
 * form-data = {
      template: “”,
      pmCodeType: [""],
      pmTime: “”,
      timePeriod: “”,
      pmType: “”,
      objects: [“”],
      pmCodes: [“”]
    }
 * @export
 * @class PmConditionsComponent
 */
@Component({
  selector: 'pm-conditions',
  templateUrl: './pm-conditions.component.html',
  styleUrls: ['./pm-conditions.component.scss']
})
export class PmConditionsComponent {
  @ViewChild("objectsTree") objectsTreeRef: TreeSelecterComponent;
  @ViewChild("pmCodesTree") pmCodesTreeRef: TreeSelecterComponent;
  @ViewChild("pmCodesTreeTpl") pmCodesTreeTpl: TreeSelecterComponent;

  /** 当前性能还是历史性能 */
  @Input() isCurrent = true;
  /** 查询状态 */
  @Input() isQuerying = false;
  // 换页
  @Output() onClickQuery = new EventEmitter<any>();

  /** collapse初始状态配置 */
  private panel = {
    active: false,
    disabled: true,
    arrow: false,
    customStyle: {
      "background": "#ffffff"
      // 'border': '0px'
    }
  };

  /** 对象选择树可见性 */
  private isObjectsVisible = false;
  /** 性能代码选择树可见性 */
  private isPmCodesVisible = false;

  // 查询条件选项
  //** 已选条件标签 */
  private tags = [];
  /** 模板列表 */
  private templateList = [
    { label: "模板A", value: "11" },
    { label: "模板B", value: "22" }];
  /** 性能时刻选项 */
  private pmTimes = [];
  private pmTimes0 = [
    { label: "当前", value: "0" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
    { label: "13", value: "13" },
    { label: "14", value: "14" },
    { label: "15", value: "15" },
    { label: "16", value: "16" }];
  private pmTimes1 = [
    { label: "当前", value: "0" },
    { label: "1", value: "1" }];
  /** 时间选项 */
  private timePeriods = [
    { label: "最近4小时", value: "0" },
    { label: "最近一天", value: "1" },
    { label: "最近两天", value: "2" },
    { label: "最近一周", value: "3" },
    { label: "最近30天", value: "4" },
    { label: "自定义", value: "custom" }];
  /** 性能类型选项 */
  private pmTypes = [
    { label: "15分钟", value: "15m" },
    { label: "24小时", value: "24h" }];
  /** 当前性能：性能代码类型选项 */
  private pmCodeTypes = [{ label: "查询最大值性能代码", value: '1', checked: false }, { label: "查询最小值性能代码", value: '0', checked: false }];
  private objectsData = [{ label: "对象", data: [node] }, { label: "区域", data: [node1] }];
  private pmCodesData = [{ label: "性能", data: [node] }];
  // 查询条件
  /** 模板 */
  private template = "";
  /** 当前性能：性能代码类型 */
  private pmCodeType = [];
  /** 当前性能：性能时刻 */
  private pmTime = "";
  /** 历史性能：时间 */
  private timePeriod = "";
  private dateRange;
  /** 性能类型 */
  private pmType = "";
  /** 对象 */
  private objects = [];
  private objects1 = [];
  /** 性能代码 */
  private pmCodes = [];
  private pmCodes1 = [];

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {ContextService} context
   * @memberof UnmPmModule
   */
  constructor(private logger: LoggerService, private context: ContextService, private unmPmService: UnmPmService) {

  }

  /**
   * 回显查询条件
   * @private
   * @memberof PmConditionsComponent
   */
  private echoTags() {
    this.tags = [];
    let obj = this.getFormData();
    if (obj.template.length > 0) {
      this.tags.push(`模板:${this.getTagLabel(obj.template, this.templateList)}`);
    }
    // 是否当前性能
    if (this.isCurrent) {
      if (obj.pmCodeType.length > 0) {
        this.tags.push(`代码类型:${this.getTagLabel(obj.pmCodeType, this.pmCodeTypes, "pmCodeType")}`);
      }
      if (obj.pmTime.length > 0) {
        this.tags.push(`性能时刻:${this.getTagLabel(obj.pmTime, this.pmTimes)}`);
      }
    } else {
      if (obj.timePeriod.length > 0) {
        this.tags.push(`时间:${this.getTagLabel(obj.timePeriod, this.timePeriods, "timePeriod")}`);
      }
    }
    if (obj.pmType.length > 0) {
      this.tags.push(`性能类型:${this.getTagLabel(obj.pmType, this.pmTypes)}`);
    }
    if (obj.objects.length > 0) {
      this.tags.push(`对象:${this.getTagLabel(obj.objects, this.objects, "same")}`);
    }
    if (obj.pmCodes.length > 0) {
      this.tags.push(`代码:${this.getTagLabel(obj.pmCodes, this.pmCodes, "same")}`);
    }
  }


  /**
   * 翻译tag显示的内容
   *
   * @private
   * @param {any} value 当前值
   * @param {Array} options 在对应的选项中获取
   * @param {string} mark 操作标志,多选等部分值需要特殊处理
   * @memberof PmConditionsComponent
   */
  private getTagLabel(value: any, options: any[], mark?: string) {
    switch (mark) {
      case "timePeriod":
        if (this.timePeriod === "custom") {
          return this.unmPmService.transformDate(this.dateRange, "yyyy-MM-dd HH:mm:ss");
        } else {
          for (let index = 0; index < options.length; index++) {
            const element = options[index];
            if (value === element.value) {
              return element.label;
            }
          }
        }
        break;
      case "pmCodeType":
        let arr = [];
        value.forEach(_value => {
          for (let index = 0; index < options.length; index++) {
            const element = options[index];
            if (_value === element.value) {
              arr.push(element.label);
            }
          }
        });
        return arr;
      case "same": return value;
      default:
        for (let index = 0; index < options.length; index++) {
          const element = options[index];
          if (value === element.value) {
            return element.label;
          }
        }
        break;
    }
  }

  /**
   * 删除条件
   * @param {string} removedTag 当前删除的条件
   * @memberof PmConditionsComponent
   */
  private onAfterTagClose(removedTag: string): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
    /** 同步tag条件到表单 */
    switch (removedTag.match(/^\W+:/)[0]) {
      case "模板:":
        this.template = "";
        break;
      case "代码类型:":
        this.pmCodeType = [];
        break;
      case "性能时刻:":
        this.pmTime = "";
        break;
      case "时间:":
        this.timePeriod = "";
        break;
      case "性能类型:":
        this.pmType = "";
        break;
      case "对象:":
        this.objects = [];
        break;
      case "代码:":
        this.pmCodes = [];
        break;
      default:
        break;
    }
  }

  private ngOnInit(): void {
    this.initFormOptions();
    this.initFormData();
  }

  /**
   *切换折叠板状态
   *
   * @memberof PmConditionsComponent
   */
  private toggleCollapse() {
    this.panel.active = !this.panel.active;
  }

  /** 对象树对话框 */
  showModal() {
    this.isObjectsVisible = true;
  }
  objectsOk() {
    this.isObjectsVisible = false;
  }
  objectsCancel() {
    this.isObjectsVisible = false;
    // this.objectsTreeRef.clearChecked();
    this.objectsTreeRef.clearAll();
  }

  /** 性能代码弹出框 */
  pmCodesChange(state: boolean) {
    console.log(state);
    // if (!state) {
    //   this.pmCodesTreeRef.clearChecked();
    // }
  }

  /**
   * 初始化表单选项
   */
  private initFormOptions() {
    this.pmTimes = this.pmTimes0;
  }
  /**
   * 初始化表单数据
   */
  private initFormData() {
    let obj = { "template": "11", "pmCodeType": ["0"], "pmTime": "0", "pmType": "15m", "objects": ["11", "22"], "pmCodes": ["33", "44"], "timePeriod": "3" }
    this.setFormData(obj);

    this.onQuery();
  }

  /**
   * 点击查询按钮，回显表单数据
   */
  private onQuery() {
    this.onClickQuery.emit();
    // this.isQuerying = true;
    this.echoTags();
  }

  /**
   * 格式化tag显示，限制tag长度
   * @param {string} tag 处理前的tag
   * @returns {string}处理后的tag
   * @memberof PmConditionsComponent
   */
  private sliceTagName(tag: string, length = 200): string {
    const isLongTag = tag.length > length;
    return isLongTag ? `${tag.slice(0, length)}...` : tag;
  }

  /**
   * 性能代码类型同步，多选，可不选
   * @param values 当前选中状态
   */
  private onCodeTypeChange(values: string[]) {
    this.pmCodeType = values;
  }

  /**
   * 性能类型切换,改变性能时刻选项
   *
   * @param {value} $event 新值
   * @memberof PmConditionsComponent
   */
  private onPMTypeChange(value) {
    if (value === "15m") {
      this.pmTimes = this.pmTimes0;
    } else {
      this.pmTimes = this.pmTimes1;
    }
  }

  /**
   * 获取当前表单数据
   */
  getFormData() {
    let obj = {
      template: this.template,
      pmCodeType: this.pmCodeType,
      pmTime: this.pmTime,
      timePeriod: this.timePeriod,
      pmType: this.pmType,
      objects: this.objects,
      pmCodes: this.pmCodes
    };
    if (this.isCurrent) {
      /** 当前告警没有时间区间字段 */
      delete obj.timePeriod;
    } else {
      /** 历史告警没有性能时刻和性能代码类型字段 */
      delete obj.pmTime;
      delete obj.pmCodeType;
      // 日期范围
      if (obj.timePeriod === "custom") {
        obj.timePeriod = String(this.unmPmService.transformDate(this.dateRange, "yyyy-MM-dd HH:mm:ss"));
      }
    }
    return obj;
  }

  /**
   * 设置查询表单控件数据
   * @param obj 需要设置到表单的值
   */
  setFormData(obj?) {
    // 无入参时重置表单
    if (obj === undefined || obj === null) {
      this.template = "";
      this.pmCodeTypes = this.pmCodeTypes.map((item) => { item.checked = false; return item; });
      this.pmCodeType = [];
      this.pmTime = "";
      this.timePeriod = "";
      this.pmType = "";
      this.objects = [];
      this.pmCodes = [];
    } else {
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && this.hasOwnProperty(key) && obj[key] != undefined) {
          this[key] = obj[key];
          // 性能代码类型选项单独处理
          if (key === "pmCodeType") {
            for (let i = 0; i < this.pmCodeTypes.length; i++) {
              const element = this.pmCodeTypes[i];
              if (obj[key].includes(element.value)) {
                this.pmCodeTypes[i].checked = true;
              } else {
                this.pmCodeTypes[i].checked = false;
              }
            }
          }

        }
      }
    }
  }
}
