export class WafMapStyle {
  // 对应模板的id
  mapId:string = 'canvas';
  // 鸟瞰图对应的模板的id
  overviewId:string = 'overview';
  // 工具栏对应的模板的id
  toolbarId:string = 'toolbar';
  // 宽
  width:string = '100%';
  // 高
  height:string= '100%';
  // overview宽
  overViewWidth:string = '150px';
  // overview高
  overViewHeight:string= '150px';
  // overview位置(0:left-top;1:right-top;2:right-bottom;3:left-bottom)
  overViewLocation:number = 0;
  // 三方拓扑控件
  thirdparty:string = 'qunee';
  // 背景类型。0：图片；1：颜色
  background:number = -1;
  // 背景图片名称
  backgroundImage:string;
  // 背景颜色
  backgroundColor:string = '#E8CCFF';
  // 地图类型。0：逻辑拓扑；1：物理拓扑
  mapType:number;
  // 是否可放大缩小
  zoomable:boolean = true;
  // 是否可拖动
  draggable:boolean;
  // 是否显示鸟瞰图
  overview:boolean;
  //  是否允许双击查看
  enableDoubleClickToOverview:boolean = true;
  // 滚轮缩放比例
  wheelZoom:number = 1.15;
  // 最小缩放比例
  minScale:number = 0.2;
  // 最大缩放比例
  maxScale:number = 0.4;
  middleScale:number;
  // 当前缩放百分比
  scale:number;
  getMapType() {
    if ('qunee' == this.thirdparty) {
      return 0;
    } else {
      return 1;
    }
  }
}
