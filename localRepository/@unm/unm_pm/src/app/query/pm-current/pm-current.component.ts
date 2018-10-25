import { Component, ViewChild } from '@angular/core';
import { constant } from '../../unm-pm.constant';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from "@waf_service/context";
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PmConditionsComponent } from '../pm-conditions/pm-conditions.component';
import { UnmPmService } from "../../service/unm-pm.service";

/**
 * pm-current
 * @export
 * @class PmCurrentComponent
 */
@Component({
  templateUrl: './pm-current.component.html',
  styleUrls: ['./pm-current.component.scss'],
  providers: [UnmPmService]
})
export class PmCurrentComponent {
  @ViewChild(PmConditionsComponent) PmConditionsComponent: PmConditionsComponent;

  conditions;
  isQuerying = false;

  data: GridDataResult;
  total = 0;
  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {ContextService} context
   * @memberof UnmPmModule
   */
  constructor(private logger: LoggerService, private context: ContextService, private unmPmService: UnmPmService) {
  }

  ngOnInit(): void {
    this.data = {
      data: [
        ["1", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao"],
        ["2", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao"],
        ["3", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao", "nihao"],
      ],
      total: 3
    }
    this.total = this.data.data.length;
  }
  /**
   * 获取表单数据
   *
   * @returns 表单数据
   * @memberof PmCurrentComponent
   */
  getConditions() {
    this.conditions = this.PmConditionsComponent.getFormData();
    return this.conditions;
  }
  /**
   *表格换页
   *
   * @param {object} obj 换页参数，{ 'pageIndex': this.pageIndex, 'pageSize': this.pageSize }
   * @memberof PmCurrentComponent
   */
  onPagerChange(obj: object) {
    console.log(JSON.stringify(obj));

  }

  /**
   * 表格导出
   *
   * @param {Array<any>} arr 导出参数，[fileType, this.mySelection]
   * @memberof PmCurrentComponent
   */
  doExport(arr: Array<any>) {
    console.log(arr);

  }

  onClickQuery(event) {
    console.log(event);

  }
}
