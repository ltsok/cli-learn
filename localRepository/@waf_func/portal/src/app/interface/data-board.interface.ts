import { DataBoardItem } from './data-board.model'

/**
 * 数据面板接口
 * @export
 * @interface IDataBoard
 */
export interface IDataBoard {

  getDataBoardItems(): DataBoardItem[];
}
