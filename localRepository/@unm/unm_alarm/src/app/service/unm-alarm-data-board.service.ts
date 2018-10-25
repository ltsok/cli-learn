import { Injectable } from "@angular/core";
import { IDataBoard, DataBoardItem } from '@waf_func/portal';

import { AlarmLevelComponent } from '../portal/data-board/alarm-level.component';
import { AlarmTypeComponent } from '../portal/data-board/alarm-type.component';
import { AlarmStatusComponent } from '../portal/data-board/alarm-status.component';
import { AlarmTopNComponent } from '../portal/data-board/alarm-topN.component';
import { KeyAlarmMonitorComponent } from '../portal/data-board/key-alarm-monitor.component';




@Injectable()
export class UnmAlarmDataBoardService implements IDataBoard {


    getDataBoardItems(): DataBoardItem[] {

        let dataBoardItems = [];

        let dataBoard1 = new DataBoardItem();
        dataBoard1.width2Height = '3:4';
        dataBoard1.default_position = "1-2";
        dataBoard1.custom_position = "1-2";
        dataBoard1.component = AlarmLevelComponent;
        dataBoardItems.push(dataBoard1);

        let dataBoard2 = new DataBoardItem();
        dataBoard2.width2Height = '3:4';
        dataBoard2.default_position = "1-3";
        dataBoard2.custom_position = "1-3";
        dataBoard2.component = AlarmTypeComponent;
        dataBoardItems.push(dataBoard2);

        let dataBoard3 = new DataBoardItem();
        dataBoard3.width2Height = '3:4';
        dataBoard3.default_position = "1-4";
        dataBoard3.custom_position = "1-4";
        dataBoard3.component = AlarmStatusComponent;
        dataBoardItems.push(dataBoard3);

        let dataBoardTemp = new DataBoardItem();
        dataBoardTemp.width2Height = '3:4';
        dataBoardTemp.default_position = "1-1";
        dataBoardTemp.custom_position = "1-4";
        dataBoardTemp.component = AlarmStatusComponent;
        dataBoardItems.push(dataBoardTemp);

        let dataBoard4 = new DataBoardItem();
        dataBoard4.width2Height = '2:1';
        dataBoard4.default_position = "2-2";
        dataBoard4.custom_position = "2-2";
        dataBoard4.component = AlarmTopNComponent;
        dataBoardItems.push(dataBoard4);

        let dataBoardTemp2 = new DataBoardItem();
        dataBoardTemp2.width2Height = '2:1';
        dataBoardTemp2.default_position = "2-1";
        dataBoardTemp2.custom_position = "2-1";
        dataBoardTemp2.component = AlarmTopNComponent;
        dataBoardItems.push(dataBoardTemp2);

        let dataBoard5 = new DataBoardItem();
        dataBoard5.width2Height = '2:1';
        dataBoard5.default_position = "4-1";
        dataBoard5.custom_position = "4-1";
        dataBoard5.component = KeyAlarmMonitorComponent;
        dataBoardItems.push(dataBoard5);
        return dataBoardItems;
    }
}

