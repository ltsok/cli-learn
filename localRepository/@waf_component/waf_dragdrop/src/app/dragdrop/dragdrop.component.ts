import { Component, Input, ViewChild, Injectable, AfterViewInit, ElementRef } from '@angular/core';

@Injectable()
export class DragService {

  /**
   * 被拖拽的区域元素
   */
  dragDom: HTMLLIElement;

  /**
   * 被拖拽区域元素的唯一子级
   */
  dragDomChildren = [];

  /**
   * 父级ul的dom对象
   */
  ul: ElementRef = null;

  /**
   * 预览块
   */
  preview: ElementRef = null;

  /**
   * 暂存被隐藏区域
   */
  unDisplayArea = [];

}

@Component({
  selector: 'd-item',
  template: `
  
  <li #li draggable="true"
   (dragstart)="dragstart($event, li)" (drop)="drop($event,li)" 
   (dragenter)="dragenter($event,li)" (dragover)="dragover($event,li)" 
   (dragleave)="dragleave($event,li)">
  <ng-content></ng-content>
  </li>
  `,
  styleUrls: ['./dragdrop.component.scss'],
})
export class DItem {



  constructor(private dragService: DragService) {

  }

  /**
   * 监听被拖拽区域的开始拖拽事件
   * @param ev 鼠标事件的实例
   * @param liDom 被拖拽的区域实例
   */
  dragstart(ev: DragEvent, liDom: HTMLLIElement) {
    ev.dataTransfer.setData('text', ' ');
    this.dragService.dragDom = liDom;
    //将拖拽对象的children复制给一个数组对象
    this.dragService.dragDomChildren = Array.from(liDom.children).concat();
    // ev.dataTransfer.setDragImage(liDom, 60, 20);
  }

  /**
  * 监听拖拽的区域在可下发区域移动的事件
  * @param ev 鼠标事件的实例
  */
  dragover(ev: DragEvent, liDom: HTMLLIElement) {
    //屏蔽dom里自定义事件
    ev.preventDefault();
    ev.stopPropagation();
  }

  /**
   * 监听拖拽区域进入可下发区域的事件
   */
  dragenter(ev: DragEvent, liDom: HTMLLIElement) {
    ev.preventDefault();
    if (liDom !== this.dragService.dragDom) {
      if (liDom.className === this.dragService.dragDom.className) {
        liDom.style.border = '1px dashed black';
        liDom.style.backgroundColor = 'white';
        (<HTMLElement>liDom.firstElementChild).style.display = 'none';
        console.log('small的拖拽移入事件');
        return;
      }
      this.dragService.unDisplayArea = [];
      this.dragService.preview.nativeElement.style.display = 'block';
      if (liDom.parentElement.className === 'left') {
        this.dragService.ul.nativeElement.insertBefore(this.dragService.preview.nativeElement, liDom.parentElement);
        liDom.parentElement.style.display = 'none';
        (<HTMLElement>liDom.parentElement.nextElementSibling).style.display = 'none';
        this.dragService.unDisplayArea.push(liDom.parentElement);
        this.dragService.unDisplayArea.push(liDom.parentElement.nextElementSibling);
      } else if (liDom.parentElement.className === 'right') {
        this.dragService.ul.nativeElement.insertBefore(this.dragService.preview.nativeElement, liDom.parentElement.previousElementSibling);
        liDom.parentElement.style.display = 'none';
        (<HTMLElement>liDom.parentElement.previousElementSibling).style.display = 'none';
        this.dragService.unDisplayArea.push(liDom.parentElement);
        this.dragService.unDisplayArea.push(liDom.parentElement.previousElementSibling);
      } else {
        this.dragService.ul.nativeElement.insertBefore(this.dragService.preview.nativeElement, liDom.parentElement.nextElementSibling);
        liDom.parentElement.style.display = 'none';
        this.dragService.unDisplayArea.push(liDom.parentElement);
      }
    }

  }

  /**
   * 监听被拖拽的区域在目标区域放下鼠标的事件
   * @param ev 鼠标事件的实例
   * @param liDom 目标区域的实例
   */
  drop(ev: DragEvent, liDom: HTMLLIElement) {
    ev.preventDefault();
    ev.stopPropagation();
    if (liDom !== this.dragService.dragDom) {
      liDom.style.border = 'none';
      liDom.style.backgroundColor = '#46566F';
      (<HTMLElement>liDom.firstElementChild).style.display = 'block';
      console.log('拖拽放下事件');

      let itemParent: HTMLElement = this.dragService.ul.nativeElement;//拖拽池的父级 ul 的dom对象
      Array.from(liDom.children).forEach((element: HTMLElement) => {
        this.dragService.dragDom.appendChild(element);
      });
      this.dragService.dragDomChildren.forEach((element: HTMLElement) => {
        liDom.appendChild(element);
      });
      this.dragService.preview.nativeElement.style.dispaly = 'none';
      itemParent.appendChild(this.dragService.preview.nativeElement);

    }

  }

  /**
   * 监听拖拽区域离开可下发区域的事件
   * @param ev 
   * @param liDom 
   */
  dragleave(ev: DragEvent, liDom: HTMLLIElement) {
    ev.preventDefault();
    ev.stopPropagation();
    if (liDom !== this.dragService.dragDom) {
      liDom.style.border = 'none';
      liDom.style.backgroundColor = '#46566F';
      (<HTMLElement>liDom.firstElementChild).style.display = 'block';
    }
  }

}

@Component({
  selector: 'drag-drop',
  template: `<div [ngStyle]="{'width':width}" style="display: flex;justify-content: flex-start;">
    <ul #ul>
      <ng-content></ng-content>
      <li #preview draggable="true" (dragstart)="dragstart($event)" (dragover)="dragover($event)" (drop)="drop($event)" (dragleave)="dragleave($event)" style="border: 1px dashed black;background-color: white;display:none;"></li>
    </ul>
  </div>
  `,
  styleUrls: ['./dragdrop.component.scss']
})
export class DragdropComponent implements AfterViewInit {

  @Input() width: string = '100%';

  @ViewChild('ul') ul: ElementRef;

  @ViewChild('preview') preview: ElementRef;

  constructor(private dragService: DragService) {
  }

  ngAfterViewInit() {
    this.dragService.ul = this.ul;
    this.dragService.preview = this.preview;
  }

  dragstart(ev: DragEvent) {
    ev.preventDefault();
    ev.dataTransfer.effectAllowed = "copy";
  }

  dragover(ev: DragEvent) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'copy';
  }

  drop(ev: DragEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.dragService.unDisplayArea[0].firstElementChild !== this.dragService.dragDom) {
      this.dragService.unDisplayArea.forEach((element: HTMLElement) => {
        element.style.display = 'block';
      });
      let dragItem: HTMLElement = this.dragService.dragDom.parentElement;//被拖拽Item
      let targetItem: HTMLElement = this.dragService.unDisplayArea[0];//目标Item
      let nextItem_d: Element = dragItem.nextElementSibling;//被拖拽Item的下一个item
      let preItem_d: Element = dragItem.previousElementSibling;//被拖拽的Item的上一个item
      let nextItem_t: Element = targetItem.nextElementSibling;//目标item的下一个item
      let preItem_t: Element = targetItem.previousElementSibling;//目标item的上一个item
      let itemParent: HTMLElement = this.dragService.ul.nativeElement;//拖拽池的父级 ul 的dom对象
      if (this.dragService.dragDom.className === 'big' && targetItem.firstElementChild.className === 'small') {//当拖拽的是大块的区域,目标是小区域
        if (targetItem.className === 'left') {//当目标item是在左边
          if (dragItem != nextItem_t.nextElementSibling) {
            itemParent.insertBefore(dragItem, nextItem_t.nextElementSibling);
          }
          itemParent.insertBefore(nextItem_t, nextItem_d);
          itemParent.insertBefore(targetItem, nextItem_t);
        } else {//当目标item是在右边
          itemParent.insertBefore(dragItem, nextItem_t);
          itemParent.insertBefore(targetItem, nextItem_d);
          itemParent.insertBefore(preItem_t, targetItem);
        }

      } else if (this.dragService.dragDom.className === 'small' && targetItem.firstElementChild.className === 'big') {//当拖拽的是小区域,目标是大区域
        if (dragItem.className === 'left') {
          if (targetItem != nextItem_d.nextElementSibling) {
            itemParent.insertBefore(targetItem, nextItem_d.nextElementSibling);
          }
          itemParent.insertBefore(nextItem_d, nextItem_t);
          itemParent.insertBefore(dragItem, nextItem_d);
        } else {
          itemParent.insertBefore(targetItem, nextItem_d);
          itemParent.insertBefore(dragItem, nextItem_t);
          itemParent.insertBefore(preItem_d, dragItem);
        }
      }
      this.dragService.preview.nativeElement.style.display = 'none';
      this.ul.nativeElement.appendChild(this.dragService.preview.nativeElement);

    }

  }

  dragleave(ev: DragEvent) {
    ev.preventDefault();
    this.dragService.preview.nativeElement.style.display = 'none';
    this.ul.nativeElement.appendChild(this.dragService.preview.nativeElement);
  }

}


