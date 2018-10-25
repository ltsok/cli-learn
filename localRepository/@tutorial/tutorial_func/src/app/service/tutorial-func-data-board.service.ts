import { Injectable } from "@angular/core";
import { IDataBoard, DataBoardItem } from '@waf_func/portal';


@Injectable()
export class TutorialFuncDataBoardService implements IDataBoard {

    getDataBoardItems(): DataBoardItem[] {
        let dataBoardItems = [];
        return dataBoardItems;
    }
}

