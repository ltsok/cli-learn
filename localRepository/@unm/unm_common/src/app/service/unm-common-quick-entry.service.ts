import { Injectable } from "@angular/core";
import { IQuickEntry, QuickEntryItem } from '@waf_func/portal';
import { BuildStationComponent } from '../portal/quick-entry/build-station.component';
import { NetworkCheckComponent } from '../portal/quick-entry/network-check.component';
import { WeeklyReportComponent } from '../portal/quick-entry/weekly-report.component';



@Injectable()
export class UnmCommonQuickEntryService implements IQuickEntry {

    getQuickEntryItems(): QuickEntryItem[] {

        let quickEntryItems = [];
        let quickEntry1 = new QuickEntryItem();
        quickEntry1.width2Height = '2:1';
        quickEntry1.rowNum = 1;
        quickEntry1.colNum = 1;
        quickEntry1.component = BuildStationComponent;
        quickEntryItems.push(quickEntry1);

        let quickEntry2 = new QuickEntryItem();
        quickEntry2.width2Height = '2:1';
        quickEntry2.rowNum = 1;
        quickEntry2.colNum = 4;
        quickEntry2.component = NetworkCheckComponent;
        quickEntryItems.push(quickEntry2);

        let quickEntry3 = new QuickEntryItem();
        quickEntry3.width2Height = '2:1';
        quickEntry3.rowNum = 1;
        quickEntry3.colNum = 2;
        quickEntry3.component = WeeklyReportComponent;
        quickEntryItems.push(quickEntry3);

        return quickEntryItems;
    }
}