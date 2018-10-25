import {Component, ViewChild, ViewChildren, QueryList, ElementRef, OnInit, Injector} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {constant} from '../../../unm-report.constant';
import {LoggerService} from '@waf_service/logger';
import {ContextService} from "@waf_service/context";
import {UnmReportHttpService} from "../../../service/unm-report-http.service";
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {TreeSelecterComponent} from '@unm_component/tree_selecter';
import { NzTreeNode } from 'ng-zorro-antd';

/**
 * report-15m-pm-objectsel
 * @export
 * @class Report15mPmCreateObjectSelComponent
 */
@Component({
  templateUrl: './report-15m-pm-objectsel.component.html',
  styleUrls: ['./report-15m-pm-objectsel.component.scss'],
  providers: [UnmReportHttpService]
})
export class Report15mPmCreateObjectSelComponent implements OnInit {
  @ViewChild("objectsTree") objectsTreeRef: TreeSelecterComponent;
  data;
  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {ContextService} context
   * @memberof UnmReportModule
   */
  constructor(private router: Router, private route: ActivatedRoute, private logger: LoggerService, private fb: FormBuilder, private context: ContextService, private reportHttpService: UnmReportHttpService) {
  }


  ngOnInit() {
  }

  ngAfterViewInit() {
    this.data = this.mockDataSource();
  }

  mockDataSource() {
    var ds1 = [];
    var ds2 = []
    var datas = [{ label: "按逻辑域", data: ds1}];
    var p = new NzTreeNode(null, null);
    p.title = '武汉市';
    p.isLeaf = false;
    p.children = [];
    ds1.push(p);
    for (var i = 0; i < 10; i++) {
      var t = new NzTreeNode(null, p);
      t.title = '' + i;
      t.isLeaf = false;
      t.parentNode = p;
      p.children.push(t);
    }
/*    for (var i = 0; i < 10; i++) {
      var t = new NzTreeNode();
      ds2.push(t);
    }*/
    return datas;
  }

  previous() {
    this.router.navigate(['../../create/basic'],{relativeTo: this.route, skipLocationChange: true});
  }

  next() {
    this.router.navigate(['../../create/codesel'],{relativeTo: this.route, skipLocationChange: true});
  }

  cancel() {
    this.router.navigate(['../..'],{relativeTo: this.route, skipLocationChange: true});
  }
}
