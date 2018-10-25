import { Injectable } from "@angular/core";
import { IQuickEntry, QuickEntryItem } from '@waf_func/portal';

@Injectable()
export class TutorialFuncQuickEntryService implements IQuickEntry {

    getQuickEntryItems(): QuickEntryItem[] {

        let quickEntryItems = [];
        return quickEntryItems;
    }
}
