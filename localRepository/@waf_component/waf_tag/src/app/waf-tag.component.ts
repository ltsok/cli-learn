import { Component, Input, EventEmitter, Output, Inject, AfterViewInit } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from '@waf_service/context';
import { WafTagItemModel } from './model/waf-tag.model'

@Component({
  selector: 'waf-tag',
  templateUrl: './waf-tag.component.html',
  styleUrls: ['./waf-tag.component.scss']
})
export class WafTagComponent {
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  tagItem = new WafTagItemModel();

  @Input()
  set item(label: any) {
    this.tagItem.label = label;
  }


  constructor(
    private logger: LoggerService,
    private context: ContextService, ) {

  }

  closeTag(event) {
    console.log("waf_tag*********");
    console.log(event);
    this.onClose.emit(event.label);
  }

}


