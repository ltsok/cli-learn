import {Inject, Component, Input, Output, EventEmitter, OnInit, ContentChildren, QueryList} from '@angular/core';
import { Observable, Observer } from 'rxjs';

import {NzFormatEmitEvent, NzTreeNode, NzModalService, NzMessageService} from 'ng-zorro-antd';
import {ContextService} from "@waf_service/context";
import { LoggerService } from '@waf_service/logger';
import * as $ from "jquery";

/**
 * 封装datatable组件
 * @export
 * @class WafDataTableToolbarComponent
 */
@Component({
  templateUrl: './waf-datatable-toolbar.component.html'
  , 'selector': 'waf-datatable-toolbar'
})
export class WafDataTableToolbarComponent implements OnInit {
  me;

  /**
   * 本表格组件数据由外部传入，不会发送查询请求，只会发导出请求
   * @param logger
   * @param context
   * @param http
   * @memberOf
   */
  constructor(private logger: LoggerService, private context: ContextService, private modalService: NzModalService, private message: NzMessageService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy(): void {
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
