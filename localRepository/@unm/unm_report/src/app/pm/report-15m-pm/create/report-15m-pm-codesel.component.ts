import {Component, ViewChild, ViewChildren, QueryList, ElementRef, OnInit, Injector} from '@angular/core';
import {constant} from '../../../unm-report.constant';
import {LoggerService} from '@waf_service/logger';
import {ContextService} from "@waf_service/context";
import {UnmReportHttpService} from "../../../service/unm-report-http.service";
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * report-15m-pm-codesel
 * @export
 * @class Report15mPmCreateCodeSelComponent
 */
@Component({
  templateUrl: './report-15m-pm-codesel.component.html',
  styleUrls: ['./report-15m-pm-codesel.component.scss'],
  providers: [UnmReportHttpService]
})
export class Report15mPmCreateCodeSelComponent implements OnInit {
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

  finish() {
    this.router.navigate(['../..'],{relativeTo: this.route, skipLocationChange: true});
  }

  previous() {
    this.router.navigate(['../../create/objectsel'],{relativeTo: this.route, skipLocationChange: true});
  }

  cancel() {
    this.router.navigate(['../..'],{relativeTo: this.route, skipLocationChange: true});
  }
}
