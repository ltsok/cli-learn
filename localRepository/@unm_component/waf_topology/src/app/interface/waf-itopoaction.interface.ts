export interface WafITopoAction {
  getId():string;
  onMapLoaded():void;
  onMapDblClick():void;
  onMapClick(target):void;
  onMapMove(top, left):void;
  onMapZoomable(flag):void;
  onNodeClick(target, top, left):void;
  onNodeDblClick(target):void;
  onNodeMouseDown(target):void;
  onNodeMouseUp(target, top, left):void;
  onNodeMouseOver(target):void;
  onNodeMouseOut(target):void;
  onNodeMouseMove(target, top, left):void;
  onNodeMouseDragStart(target):void;
  onNodeMouseDragEnd(target):void;
  onNodeMouseDragging(target):void;
  onLinkClick(target, top, left):void;
  onLinkDblClick(target):void;
  onLinkMouseOver(target, top, left):void;
  onLinkMouseOut(target):void;
  onLinkMouseMove(target, top, left):void;
  onRangeMouseOver(target):void;
  onRangeMouseOut(target):void;
  onRangeMouseMove(target):void;
  onRangeMouseDown(target):void;
  onRangeMouseUp(target):void;
  onRangeDbClick(target):void;
  onPortClick(target):void;
  onPortDblClick(target):void;
  onPortMouseOver(target):void;
  onPortMouseOut(target):void;
}