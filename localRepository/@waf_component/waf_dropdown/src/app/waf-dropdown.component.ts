import { Component, Input, Output, EventEmitter, Renderer2, Inject, AfterViewInit, ComponentFactoryResolver, ViewChildren, QueryList, ViewContainerRef } from '@angular/core';
import { LoggerService } from '@waf_service/logger';
import { ContextService } from '@waf_service/context';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { forwardRef } from '@angular/core';

@Component({
  selector: 'waf-dropdown',
  templateUrl: './waf-dropdown.component.html',
  styleUrls: ['./waf-dropdown.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WafDropdownComponent),
    multi: true
  }]
})
export class WafDropdownComponent implements ControlValueAccessor {
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  width = '250px';//默认宽度
  onValueChange: Function = () => { };
  onValueblur: Function = () => { };
  registerOnChange(fn) {
    this.onValueChange = fn;

  }

  registerOnTouched(fn) {
    this.onValueblur = fn;
  }
  writeValue(value: any) {
    if (value) {
      this.selectedItemArray = value;
    }
    this.updateShowValue();
  }
  /**
   * 构造函数
   * @param {IDashboard[]} dashboardServices
   * @param {LoggerService} logger
   * @param {ComponentFactoryResolver} compResolver
   * @param {ContextService} context
   * @memberof DefaultComponent
   */
  constructor(
    private logger: LoggerService, private compResolver: ComponentFactoryResolver,
    private context: ContextService, private renderer: Renderer2) {

  }
  selectedValue = "";

  @Input()
  set dropDownWidth(value: any) {
    this.width = value;
  }

  @Input()
  set dropdownOptions(value: any) {
    this.items = value;
  }
  items = [];


  selectedItemArray = [];

  clickItem(item) {
    //1、click每个item，切换选中状态
    if (item.selected) {
      item.selected = false;
    } else {
      item.selected = true;
    }
    //2、click每个item，还需通知更新回显当前已选中项。
    this.updateSelectArray(item);
    //3、将当前选中对象返回父组件中
    this.onValueChange(this.selectedItemArray);
    this.onChange.emit(item);
  }

  updateSelectArray(item) {
    //若item为选中状态，则需添加至已选数组中。
    if (item.selected) {
      this.selectedItemArray.push(item);
    }
    //若item为未选中状态，则需从已选数组中删除。
    else {
      this.deleteArrayElement(this.selectedItemArray, item);
    }
    this.updateShowValue();
  }

  updateShowValue() {
    let value = "";
    this.selectedItemArray.forEach((item) => {
      if (value == "") {
        value += item.label;
      } else {
        value += "," + item.label;
      }

    })
    this.selectedValue = value;
  }

  ngOnInit() {

  }
  ngAfterViewInit() {

  }

  deleteArrayElement(array, element) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].value == element.value) {
        array.splice(i, 1);
        return array;
      }
    }
    return array;
  }
}


