
/**
 * 对外模型：主页数据源模型
 * @export
 * @class DataBoardItem
 */
export class DataBoardItem {

  /*固定模板情况下，放置位置*/
  default_position: string;
  /*宽高比例，用于固定模板中，如：4:3,16:9*/
  width2Height: string;

  /*自定义模板情况下，放置位置*/
  custom_position: string;
  /** 大小，用于自定义模板中，目前仅支持1/2及1，默认为1/2*1/2大小 */
  size: string;
  /** 用户自动以模板中，也支持设置宽高比，目前默认为2:1*/
  custom_width2Height: string = "2:1";
  /** 组件 */
  component: any;
}

export class DefaultDataBoardItem {
  /** 唯一标示id，目前一般为rowNum-colNum,对应DataBoardItem中 default_position*/
  id: string;
  /** 数据面板所在行 */
  rowNum: string;
  /** 数据面板所在列 */
  colNum: string;
  /*宽高比例，用于固定模板中，如：4:3,16:9*/
  width2Height: string;
  /** 组件 */
  component: any;
}

export class CustomDataBoardItem {
  /** 唯一标示id，目前一般为rowNum-colNum ，对应DataBoardItem中 custom_position*/
  id: string;
  /** 数据面板所在行 */
  rowNum: string;
  /** 数据面板所在列 */
  colNum: string;
  /** 大小，用于自定义模板中，目前仅支持1/2及1，默认为1/2*1/2大小 */
  size: string;
  /** 用户自动以模板中，也支持设置宽高比*/
  custom_width2Height: string;
  /** 组件 */
  component: any;
}

