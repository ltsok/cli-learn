
/**
 * 主页快捷入口模型
 * @export
 * @class QuickEntryItem
 */
export class QuickEntryItem {

  /** QuickEntryItem序号 */
  index: number;

  /*宽高比例，如：4:3,16:9*/
  width2Height: string;

  /** 行序号 */
  rowNum: number;

  /** 列序号 */
  colNum: number;

  /** 组件 */
  component: any;
}

