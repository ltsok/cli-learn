/**
 * waf_layout模型
 * @export
 * @class WafLayoutModel
 */
export class WafLayoutItemModel {

    /** id：用来唯一标示dom中位置 */
    id: string;
    /** 行序号 */
    rowNum: number;
    /** 列序号 */
    colNum: number;
    /*宽高比例，如：4:3,16:9*/
    width2Height: string;

    /*对应ng-zoroo中grid所占用屏幕宽度：总宽度为24*/
    width: number;

    /** 组件 */
    component: any;

    /** 样式 */
    class: string;

}



