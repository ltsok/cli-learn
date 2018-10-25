import {Component, ViewChild, ViewChildren, QueryList, ElementRef, OnInit, Injector} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {constant} from '../../../unm-report.constant';
import {LoggerService} from '@waf_service/logger';
import {ContextService} from "@waf_service/context";
import {UnmReportHttpService} from "../../../service/unm-report-http.service";
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

/**
 * report-15m-pm-basic
 * @export
 * @class Report15mPmCreateBasicComponent
 */
@Component({
  templateUrl: './report-15m-pm-basic.component.html',
  styleUrls: ['./report-15m-pm-basic.component.scss'],
  providers: [UnmReportHttpService]
})
export class Report15mPmCreateBasicComponent implements OnInit {
  mainForm: FormGroup;
  selectedHour;
  hours;
  selectedWeek;
  weeks;
  defaultWeeks = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
  days;
  selectedDay;
  months;
  selectedMonth;

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {ContextService} context
   * @memberof UnmReportModule
   */
  constructor(private router: Router, private route: ActivatedRoute, private logger: LoggerService, private fb: FormBuilder, private context: ContextService, private reportHttpService: UnmReportHttpService) {
  }

  initForm() {
    // 初始化查询表单
    this.mainForm = this.fb.group({
      tastName: [''],
      taskType: [''],
      selectedHour: [null],
      selectedWeek: [null],
      selectedDay: [null],
      selectedMonth: [null],
      taskDateRange: [ [] ],
      taskExecuteTime : [ null ]
    });
  }

  submitForm(): void {
    console.log('this.mainForm.value = ', this.mainForm.value);
  }

  ngOnInit() {
    this.initForm();
    this.hours = [];
    for (var i = 1; i <= 24; i++) {
      this.hours.push({'label':i, value:i});
    }
    this.days = [];
    for (var i = 1; i <= 365; i++) {
      this.days.push({'label':i, value:i});
    }
    this.weeks = [];
    for (var i = 0; i < this.defaultWeeks.length; i++) {
      this.weeks.push({'label':this.defaultWeeks[i], value:i});
    }
    this.months = [];
    for (var i = 1; i <= 31; i++) {
      this.months.push({'label':i, 'value':i});
    }
    this.months.push({'label':'最后一天', 'value':32});
  }

  ngAfterViewInit() {
  }

  next() {
    this.router.navigate(['../../create/objectsel'],{relativeTo: this.route, skipLocationChange: true});
  }

  cancel() {
    this.router.navigate(['../..'],{relativeTo: this.route, skipLocationChange: true});
  }
}
