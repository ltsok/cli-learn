import { NzTreeNode } from 'ng-zorro-antd';
/**
 * treeSelecter模型
 * @export
 * @class TreeSelecterModel
 */
export class TreeSelecterModel {
}

export interface DataSource {
    label: string;
    data: NzTreeNode[],
    checkedNodes: NzTreeNode[]
}
