import {Component, ViewChild, ViewChildren, QueryList, ElementRef, OnInit, Injector} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {constant} from '../../../unm-report.constant';
import {LoggerService} from '@waf_service/logger';
import {ContextService} from "@waf_service/context";
import {UnmReportHttpService} from "../../../service/unm-report-http.service";
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

/**
 * report-15m-pm-objectsel
 * @export
 * @class Report15mPmModifyObjectSelComponent
 */
@Component({
  templateUrl: './report-15m-pm-objectsel.component.html',
  styleUrls: ['./report-15m-pm-objectsel.component.scss'],
  providers: [UnmReportHttpService]
})
export class Report15mPmModifyObjectSelComponent implements OnInit {
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
  }

  previous() {
    this.router.navigate(['../../modify/basic'],{relativeTo: this.route, skipLocationChange: true});
  }

  next() {
    this.router.navigate(['../../modify/codesel'],{relativeTo: this.route, skipLocationChange: true});
  }

  cancel() {
    this.router.navigate(['../..'],{relativeTo: this.route, skipLocationChange: true});
  }
}
