/**
 * unm_report模型
 * @export
 * @class UnmReportModel
 */
export class UnmReportModel {
}

// 类型标志
export const TYPES = {
  'custom': "custom",
  'board': 'board',
  'ne': 'ne',
  'omodule': 'omodule',
  'port': 'port',
  'shelf': 'shelf',
  'slot': 'slot',
}

// 常用色配置
export const colors = ['#00bdbd', '#6ea7f4', '#cd94ea', '#48c479', '#e18cbc', '#f0d74e', '#edc579', '#ed7987', '#ed8c79', '#ededed'];

/**
 * @param statisticFieldsOptions 统计维度,U2000规则是value值对应为该列在全部查询列中的位置
 * @param statisticCols 统计结果数据列
 * @param colConfigs 查询列初始配置，请勿更改列顺序
 */

/**
 * 框查询默认列配置
 * @export 
 */
export const shelfConfig = {
  'statisticFieldsOptions': [
    { "label": "逻辑域", "value": 1, "checked": false },
    { "label": "网元", "value": 2, "checked": false },
    { "label": "框类型", "value": 4, "checked": true }
  ],
  "statisticCols": [
    { "name": "框数量", "hidden": false, }
  ],
  "colConfigs": [
    { "name": "序号", "hidden": false, "width": "130" },
    { "name": "逻辑域", "hidden": false, "width": "130" },
    { "name": "网元", "hidden": false, "width": "130" },
    { "name": "框", "hidden": false, "width": "130" },
    { "name": "框类型", "hidden": false, "width": "130" },
    { "name": "局", "hidden": false, "width": "130" },
    { "name": "架", "hidden": false, "width": "130" },
    { "name": "架位号", "hidden": false, "width": "130" },
    { "name": "对象定位", "hidden": true, "width": "130" },
  ]
};

/**
 * 单盘查询默认列配置
 * @export 
 */
export const boardConfig = {
  'statisticFieldsOptions': [
    { "label": "单盘类型", "value": 2, "checked": false },
    { "label": "逻辑域", "value": 4, "checked": true },
    { "label": "网元", "value": 5, "checked": false },
    { "label": "软件版本", "value": 9, "checked": false },
    { "label": "硬件版本", "value": 10, "checked": false },
  ],
  "statisticCols": [
    { "name": "总计", "hidden": false, }
  ],
  "colConfigs": [
    { "name": "序号", "hidden": false, "width": "130" },
    { "name": "单盘名称", "hidden": false, "width": "130" },
    { "name": "单盘类型", "hidden": false, "width": "130" },
    { "name": "设备类型", "hidden": false, "width": "130" },
    { "name": "逻辑域", "hidden": false, "width": "130" },
    { "name": "网元", "hidden": false, "width": "130" },
    { "name": "网元类型", "hidden": false, "width": "130" },
    { "name": "机框框号", "hidden": false, "width": "130" },
    { "name": "槽位号", "hidden": false, "width": "130" },
    { "name": "软件版本", "hidden": false, "width": "130" },
    { "name": "硬件版本", "hidden": false, "width": "130" },
    { "name": "编程时间", "hidden": false, "width": "130" },
    { "name": "单盘序列号", "hidden": false, "width": "130" },
    { "name": "创建时间", "hidden": false, "width": "130" },
    { "name": "盘别名", "hidden": false, "width": "130" },
    { "name": "备注", "hidden": false, "width": "130" },
    { "name": "单盘状态", "hidden": false, "width": "130" },
    { "name": "单盘激活状态", "hidden": false, "width": "130" },
    { "name": "对象定位", "hidden": true, "width": "130" },
  ]
};

/**
 * 槽位查询默认列配置
 * @export 
 */
export const slotConfig = {
  "statisticFieldsOptions": [
    { "label": "逻辑域", "value": 1, "checked": false },
    { "label": "网元", "value": 2, "checked": true },
    { "label": "网元类型", "value": 3, "checked": false },
  ],
  "statisticCols": [
    { "name": "槽位总数", "hidden": true, },
    { "name": "占用槽位数", "hidden": true, },
    { "name": "占用比", "hidden": false, },
    { "name": "空闲比", "hidden": true, },
  ],
  "colConfigs": [
    { "name": "序号", "hidden": false, "width": "130" },
    { "name": "逻辑域", "hidden": false, "width": "130" },
    { "name": "网元", "hidden": false, "width": "130" },
    { "name": "网元类型", "hidden": false, "width": "130" },
    { "name": "所属机框", "hidden": false, "width": "130" },
    { "name": "槽位号", "hidden": false, "width": "130" },
    { "name": "槽地址", "hidden": false, "width": "130" },
    { "name": "槽名称", "hidden": false, "width": "130" },
    { "name": "槽上盘名", "hidden": false, "width": "130" },
    { "name": "对象定位", "hidden": true, "width": "130" },
  ]
};

/**
 * 光模块查询默认列配置
 * @export 
 */
export const oModuleConfig = {
  "statisticFieldsOptions": [
    { "label": "逻辑域", "value": 2, "checked": false },
    { "label": "网元名", "value": 3, "checked": false },
    // { "label": "设备类型", "value": 4, "checked": false },
    // { "label": "单盘类型", "value": 5, "checked": false },
    // { "label": "模块类型", "value": 9, "checked": true },
    { "label": "速率", "value": 12, "checked": true }
  ],
  // TODO 缺数据，统计结果列名暂时未知
  "statisticCols": [
  ],
  "colConfigs": [
    { "name": "序号", "hidden": false, "width": "130" },
    { "name": "条目状态", "hidden": false, "width": "130" },
    { "name": "逻辑域", "hidden": false, "width": "130" },
    { "name": "网元", "hidden": false, "width": "130" },
    { "name": "设备类型", "hidden": false, "width": "130" },
    { "name": "单盘类型", "hidden": false, "width": "130" },
    { "name": "单盘名称", "hidden": false, "width": "130" },
    { "name": "端口类型", "hidden": false, "width": "130" },
    { "name": "端口", "hidden": false, "width": "130" },
    { "name": "模块类型", "hidden": false, "width": "130" },
    { "name": "应用代码", "hidden": false, "width": "130" },
    { "name": "传输距离", "hidden": false, "width": "130" },
    { "name": "支持速率", "hidden": false, "width": "130" },
    { "name": "波长窗口", "hidden": false, "width": "130" },
    { "name": "波长", "hidden": false, "width": "130" },
    { "name": "接收机类型", "hidden": false, "width": "130" },
    { "name": "灵敏度", "hidden": false, "width": "130" },
    { "name": "过载点", "hidden": false, "width": "130" },
    { "name": "调制方式", "hidden": false, "width": "130" },
    { "name": "SN号", "hidden": false, "width": "130" },
    { "name": "其他信息", "hidden": false, "width": "130" },
    { "name": "对象定位", "hidden": true, "width": "130" },
  ]
};

/**
 * 网元查询默认列配置
 * @export 
 */
export const NEConfig = {
  'statisticFieldsOptions': [
    { "label": "逻辑域", "value": 1, "checked": false },
    { "label": "网元类型", "value": 4, "checked": true },],
  "statisticCols": [
    { "name": "网元数量", "hidden": false, }
  ],
  "colConfigs": [
    { "name": "序号", "hidden": false, "width": "130" },
    { "name": "逻辑域", "hidden": false, "width": "130" },
    { "name": "网元名", "hidden": false, "width": "130" },
    { "name": "自定义网元ID", "hidden": false, "width": "130" },
    { "name": "网元类型", "hidden": false, "width": "130" },
    { "name": "所属区域", "hidden": false, "width": "130" },
    { "name": "EMU盘类型", "hidden": false, "width": "130" },
    { "name": "网元IP地址", "hidden": false, "width": "130" },
    { "name": "设备上网管时间", "hidden": false, "width": "130" },
    { "name": "用户标签", "hidden": false, "width": "130" },
    { "name": "网元SN号", "hidden": false, "width": "130" },
    { "name": "网元维护状态", "hidden": false, "width": "130" },
    { "name": "开关号1", "hidden": false, "width": "130" },
    { "name": "开关号2", "hidden": false, "width": "130" },
    { "name": "网元号", "hidden": false, "width": "130" },
    { "name": "对象定位", "hidden": true, "width": "130" },
  ]
};

/**
 * 端口默认配置
 * @export 
 */
export const portConfig = {
  "statisticFieldsOptions": [
    { "label": "逻辑域", "value": 1, "checked": false },
    { "label": "网元", "value": 2, "checked": false },
    { "label": "端口速率", "value": 13, "checked": true }
  ],
  "statisticCols": [
    { "name": "端口总数", "hidden": true, },
    { "name": "已用端口数", "hidden": true, },
    { "name": "空闲端口数", "hidden": true, },
    { "name": "端口使用率", "hidden": false, }
  ],
  "colConfigs": [
    { "name": "序号", "hidden": false, "width": "130" },
    { "name": "逻辑域", "hidden": false, "width": "130" },
    { "name": "网元名称", "hidden": false, "width": "130" },
    { "name": "网元类型", "hidden": false, "width": "130" },
    { "name": "网元IP地址", "hidden": false, "width": "130" },
    { "name": "槽地址", "hidden": false, "width": "130" },
    { "name": "单盘名称", "hidden": false, "width": "130" },
    { "name": "单盘类型", "hidden": false, "width": "130" },
    { "name": "设备类型", "hidden": false, "width": "130" },
    { "name": "盘端口号", "hidden": false, "width": "130" },
    { "name": "盘端口名称", "hidden": false, "width": "130" },
    { "name": "盘端口类型", "hidden": false, "width": "130" },
    { "name": "使用状态", "hidden": false, "width": "130" },
    { "name": "端口速率", "hidden": false, "width": "130" },
    { "name": "端口标注", "hidden": false, "width": "130" },
    { "name": "波长", "hidden": false, "width": "160" },
    { "name": "端口丝印名", "hidden": false, "width": "130" },
    { "name": "端口方向", "hidden": false, "width": "130" },
    { "name": "支持业务", "hidden": false, "width": "130" },
    { "name": "对象定位", "hidden": true, "width": "160" },
  ]
};

/**
 * 自定义报表编辑配置
 * @export 
 */
export const colCategories = [
  {
    "name": "对象",
    "allChecked": false,
    "indeterminate": true,
    "colsOptions": [
      { "label": "逻辑域", "value": 1, "checked": false },
      { "label": "网元名", "value": 2, "checked": false },
      { "label": "网元类型", "value": 3, "checked": true },
      { "label": "单盘名", "value": 4, "checked": false },
      { "label": "端口", "value": 5, "checked": false },
      { "label": "端口标注", "value": 6, "checked": true },
    ],
  },
  {
    "name": "告警",
    "allChecked": true,
    "indeterminate": true,
    "colsOptions": [
      { "label": "编号", "value": 1, "checked": false },
      { "label": "级别", "value": 2, "checked": false },
      { "label": "告警名", "value": 3, "checked": true },
      { "label": "确认状态", "value": 4, "checked": false },
      { "label": "清除状态", "value": 5, "checked": false },
      { "label": "告警类型", "value": 6, "checked": true },
      { "label": "告警代码", "value": 7, "checked": false },
      { "label": "首次发生时间", "value": 8, "checked": false },
      { "label": "最近发生时间", "value": 91, "checked": true },
    ],
  },
  {
    "name": "性能",
    "allChecked": false,
    "indeterminate": true,
    "colsOptions": [
      { "label": "性能分组", "value": 1, "checked": false },
      { "label": "性能代码类型", "value": 2, "checked": false },
      { "label": "性能代码", "value": 3, "checked": true },
      { "label": "英文性能代码", "value": 4, "checked": false },
      { "label": "性能值", "value": 5, "checked": false },
      { "label": "单位", "value": 6, "checked": true },
      { "label": "开始时间", "value": 7, "checked": false },
      { "label": "结束时间", "value": 8, "checked": false },
    ],
  },
];
