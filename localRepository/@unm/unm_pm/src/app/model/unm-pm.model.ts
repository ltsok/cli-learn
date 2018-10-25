import { NzTreeNode } from 'ng-zorro-antd';
/**
 * unm_pm模型
 * @export
 * @class UnmPmModel
 */
export class UnmPmModel {
}

export const node = new NzTreeNode({
    title: 'root1',
    key: '1',
    children: [
        {
            title: 'child1',
            key: '11',
            children: [
                {
                    title: 'child1.1',
                    key: '111',
                    children: []
                },
                {
                    title: 'child1.2',
                    key: '112',
                    children: [
                        {
                            title: 'grandchild1.2.1',
                            key: '1121',
                            isLeaf: true
                        }
                    ]
                }
            ]
        },
        {
            title: 'child2',
            key: '12',
            isLeaf: true
        }
    ]
})
export const node1 = new NzTreeNode({
    title: 'root2',
    key: '2',
    children: [
        {
            title: 'child1',
            key: '21',
            children: [
                {
                    title: 'child1.1',
                    key: '211',
                    children: []
                },
                {
                    title: 'child1.2',
                    key: '212',
                    children: [
                        {
                            title: 'grandchild1.2.1',
                            key: '2121',
                            isLeaf: true
                        }
                    ]
                }
            ]
        },
        {
            title: 'child2',
            key: '22',
            isLeaf: true
        }
    ]
})
