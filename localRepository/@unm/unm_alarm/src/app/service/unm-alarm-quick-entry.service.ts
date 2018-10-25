import { Injectable } from "@angular/core";
import { IQuickEntry, QuickEntryItem } from '@waf_func/portal';
import { AlarmProcessComponent } from '../portal/quick-entry/alarm-process.component';



@Injectable()
export class UnmAlarmQuickEntryService implements IQuickEntry {

    getQuickEntryItems(): QuickEntryItem[] {

        let quickEntryItems = [];
        let quickEntry = new QuickEntryItem();
        quickEntry.width2Height = '2:1';
        quickEntry.rowNum = 1;
        quickEntry.colNum = 3;
        quickEntry.component = AlarmProcessComponent;
        quickEntryItems.push(quickEntry);

        return quickEntryItems;
    }
}