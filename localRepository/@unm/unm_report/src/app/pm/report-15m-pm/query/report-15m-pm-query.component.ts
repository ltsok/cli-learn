import {Component, ViewChild, ViewChildren, QueryList, ElementRef, OnInit, Injector} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {constant} from '../../../unm-report.constant';
import {LoggerService} from '@waf_service/logger';
import {ContextService} from "@waf_service/context";
import {UnmReportHttpService} from "../../../service/unm-report-http.service";
import {
  GridComponent,
  GridDataResult,
  PageChangeEvent,
  DataStateChangeEvent,
  SelectableSettings,
  SelectAllCheckboxState
} from '@progress/kendo-angular-grid';
import {WafDataTableComponent} from '@unm_component/waf_datatable';

/**
 * report-15m-pm
 * @export
 * @class Report15mPmQueryComponent
 */
@Component({
  templateUrl: './report-15m-pm-query.component.html',
  styleUrls: ['./report-15m-pm-query.component.scss'],
  providers: [UnmReportHttpService]
})
export class Report15mPmQueryComponent implements OnInit {
  selectedIndex: number = 0;
  // 表格数据
  data: GridDataResult;
  total;

  mainTabDisabled:boolean = false;

  @ViewChildren(WafDataTableComponent)
  datatables: QueryList<WafDataTableComponent>;
  detailTable:any;

  tabs = ['任务管理'];
  oldOnResize;

  selectedTime;
  detailTimes;

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @param {ContextService} context
   * @memberof UnmReportModule
   */
  constructor(private router: Router, private route: ActivatedRoute, private logger: LoggerService, private context: ContextService, private reportHttpService: UnmReportHttpService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    var me = this;
    var cols = [{"name": "任务名称", "hidden": false, "width": "130"},
      {
        "name": "操作",
        "hidden": false,
        "width": "130",
        "command": true,
        "items": [{"name": "fh-chakanliexiangqing", "title": "1"}, {
          "name": "fh-bianji",
          "title": "2"
        }, {"name": "fh-fuzhi", "title": "3"}]
      },
      {"name": "是否启用", "hidden": false, "width": "130"},
      {"name": "任务状态", "hidden": false, "width": "130"},
      {"name": "任务类型", "hidden": false, "width": "130"},
      {"name": "任务起始时间", "hidden": false, "width": "130"},
      {"name": "任务结束时间", "hidden": false, "width": "130"},
      {"name": "任务执行时间点", "hidden": false, "width": "130"},
      {"name": "上次执行时间", "hidden": false, "width": "130"},
      {"name": "下次执行时间", "hidden": false, "width": "130"}
    ];
    console.log('this.datatables = ', this.datatables);
    this.datatables.toArray()[0].setCols(cols);
    this.datatables.toArray()[0].setUserCmds([{"name": "fh-queren", "title": "确认"},{"name": "fh-fanqueren", "title": "反确认"},{"name": "fh-querenbingbeizhu", "title": "确认并备注"},{"name": "fh-shanchu", "title": "删除"}]);

    var data = [];
    data = this.mockDatas(0);
    this.datatables.toArray()[0].setDataSource({data: data, total: data.length}, 0);

    this.resetTableStyle();
    this.oldOnResize = window.onresize;
    if (typeof this.oldOnResize != 'function') {
      window.onresize = function() {
        me.resetTableStyle();
      }
    } else {
      window.onresize = function() {
        me.oldOnResize();
        me.resetTableStyle();
      }
    }

    this.detailTimes = [{'label':'近三天', value:'0'},{'label':'近一周', value:'1'},{'label':'近一个月', value:'2'}];
  }

  resetTableStyle() {
    var shortcut = document.getElementById('shortcut').offsetHeight;
    var menu = document.getElementById('menu').offsetHeight;
    var body = document.body.clientHeight;
    var theHeight = body - shortcut - menu - 10;
    console.log('theHeight = ', theHeight);
    this.datatables.toArray()[0].setHeight(theHeight - 50);
    if (null != this.detailTable) {
      this.detailTable.setHeight(theHeight - 85);
    }
  }

  ngOnDestroy() {
    var me = this;
    if (null != this.oldOnResize) {
      window.onresize = function() {
        me.oldOnResize();
      }
    } else {
      window.onresize = function() {
      }
    }
  }

  mockDatas(type:number) {
    var data = [];
    if (0 == type) {
      for (var i = 0; i < 151; i++) {
        var imgName = 'fh-yiwancheng';
        var imgColor = 'red';
        var imgTitle = '已完成';
        if (i % 3 == 1) {
          imgName = 'fh-jinhangzhong';
          imgTitle = '进行中';
          imgColor = 'green';
        } else if (i % 3 == 2) {
          imgName = 'fh-weiwancheng';
          imgTitle = '未完成';
          imgColor = 'orange';
        }
        var item = ['xxx' + i, 's' + i, imgTitle, '2018-10-15', '2018-10-15', '2018-10-15', '2018-10-15', '2018-10-15', '11', 'id_' + i];
        data.push(item);
      }
    } else if (1 == type) {
      for (var i = 0; i < 5; i++) {
        var imgName = 'fh-yiwancheng';
        var imgTitle = '已完成';
        var item = ['xxx' + i, 's' + i, imgTitle, '2018-10-15', '2018-10-15', '2018-10-15', '2018-10-15', '2018-10-15', '11', 'id_' + i];
        data.push(item);
      }
    }
    return data;
  }

  /**
   * 导出
   */
  doExport(fileType: string) {
    var me = this;
    console.log('doExport = ', fileType);
/*    this.reportHttpService.exportData("ne", fileType, (res) => {
    });*/
    window.setTimeout(function(){
      me.datatables.toArray()[0].doExportFinished();
    }, 1 * 1000);
  }

  doDetailExport(fileType: string) {
    var me = this;
    console.log('doDetailExport = ', fileType);
    /*    this.reportHttpService.exportData("ne", fileType, (res) => {
        });*/
    window.setTimeout(function(){
      me.datatables.toArray()[1].doExportFinished();
    }, 1 * 1000);
  }

  onAdd($event) {
    console.log('onAdd....');
/*    var data = [];
    data = this.mockDatas(1);
    this.datatables.toArray()[0].setDataSource({data: data, total: data.length}, 1);*/

    this.router.navigate(['create/basic'],{relativeTo: this.route, skipLocationChange: true});
  }

  onUserDefCmd($event) {
    console.log('onUserDefCmd,', $event);
    if ($event.index == 3 && $event.isLastPage == false) {
      // todo query
    } else if ($event.index == 3 && $event.isLastPage == true) {
      this.datatables.toArray()[0].doDeleteFinished();
    }
  }

  /**
   * 切换页码、切换页大小响应
   */
  onPagerChange(obj) {
/*    this.reportHttpService.queryPage("ne", obj.pageIndex, obj.pageSize, (res) => {
      this.data = this.reportHttpService.getFormatedPage(res);
    })*/
    console.log('onPagerChange', obj);
    var data = [];
    data = this.mockDatas(0);
    var total = data.length;
    var newData = data.slice((obj.pageIndex - 1) * obj.pageSize, obj.pageIndex * obj.pageSize);
    this.datatables.toArray()[0].setDataSource({data: newData, total: total}, 0);
  }

  onDetailPagerChange(obj) {
    console.log('onDetailPagerChange', obj);
  }

  onCommandClicked($event) {
    var me = this;
    console.log('onCommandClicked = ', $event);
    if (2 == $event.commandIndex) {
      /*window.setTimeout(function(){
        me.datatables.toArray()[0].doCopyFinished(null);
      }, 1 * 1000);*/
      this.router.navigate(['create/basic'],{relativeTo: this.route, skipLocationChange: true});
    } else if (0 == $event.commandIndex) {
      this.openDetailTab($event.dateItem[1] + '任务结果详情');
    } else if (1 == $event.commandIndex) {
      this.router.navigate(['modify/basic'],{relativeTo: this.route, skipLocationChange: true});
    }
  }

  mockDetailDatas(type:number) {
    var data = [];
    if (0 == type) {
      for (var i = 0; i < 151; i++) {
        var imgName = 'fh-yiwancheng';
        var imgColor = 'red';
        var imgTitle = '已完成';
        if (i % 3 == 1) {
          imgName = 'fh-jinhangzhong';
          imgTitle = '进行中';
          imgColor = 'green';
        } else if (i % 3 == 2) {
          imgName = 'fh-weiwancheng';
          imgTitle = '未完成';
          imgColor = 'orange';
        }
        var item = [{'text':imgTitle, 'img':{'name':imgName,'title':imgTitle, 'color':imgColor}}, '2018-10-15', '2018-10-15', '00/00 00:00'];
        data.push(item);
      }
    }
    return data;
  }

  openDetailTab(newTabName:string):void {
    this.mainTabDisabled = true;
    this.tabs.push(newTabName);
    this.selectedIndex = 1;
  }

  closeDetailTab(tab: any): void {
    this.mainTabDisabled = false;
    this.tabs.splice(1, 1);
    this.selectedIndex = 0;
  }

  onInit($event) {
    if ($event.getId() == 'pm-15m-detail') {
      this.detailTable = $event;
      this.initDetaiTable();
    }
  }

  initDetaiTable() {
    var cols = [
      {"name": "任务状态", "hidden": false, "width": "200", "type":"imgText"},
      {"name": "任务执行时间点", "hidden": false, "width": "130"},
      {"name": "上次执行时间", "hidden": false, "width": "130"},
      {"name": "下次执行时间", "hidden": false, "width": "130"}
    ];
    this.detailTable.setCols(cols);
    var data = [];
    data = this.mockDetailDatas(0);
    this.detailTable.setDataSource({data: data, total: data.length}, 0);
    this.resetTableStyle();
  }
}
