import { QuickEntryItem } from './quick-entry.model'

/**
 * 快捷入口接口
 * @export
 * @interface IQuickEntry
 */
export interface IQuickEntry {
  getQuickEntryItems(): QuickEntryItem[];
}
