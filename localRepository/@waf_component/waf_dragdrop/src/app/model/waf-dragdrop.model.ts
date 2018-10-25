/**
 * waf_drapdrop模型
 * @export
 * @class WafDragDropItemModel
 */
export class WafDragDropItemModel {

    /** id：用来唯一标示dom中位置 */
    id: string;
    /** 行序号 */
    rowNum: number;
    /** 列序号 */
    colNum: number;

    /*目前drapdrop仅支持两类size：big/small 对应屏幕1/2或1 宽度,不传则默认为1/2宽度*/
    size: string;

    /** 用户自动以模板中，也支持设置宽高比*/
    custom_width2Height: string;

    /** 组件 */
    component: any;
}



