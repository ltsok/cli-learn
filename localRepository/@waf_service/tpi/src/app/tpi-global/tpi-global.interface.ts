
/**
 * 全局接口
 * @export
 * @interface ITpiGlobal
 */
export interface ITpiGlobal {

  /**
   * 显示Loading框
   * @memberof ITpiGlobal
   */
  showLoading(): void;

  /**
   * 隐藏Loading框
   * @memberof ITpiGlobal
   */
  hideLoading(): void;

  /**
   * 弹出确认框
   * @param {string} msgKey
   * @param {() => void} accept
   * @param {() => void} [reject]
   * @memberof ITpiGlobal
   */
  confirmDialog(msgKey: string, accept: () => void, reject?: () => void): void;

  /**
   * 弹出警告框
   * @param {string} msgKey
   * @memberof ITpiGlobal
   */
  warnDialog(msgKey: string): void;

  /**
   * 弹出错误框
   * @param {string} msgKey
   * @memberof ITpiGlobal
   */
  errorDialog(msgKey: string): void;

  /**
   * 弹出成功框
   * @param {string} msgKey
   * @param {() => void} [callback]
   * @param {boolean} [auto]
   * @param {number} [delay]
   * @memberof ITpiGlobal
   */
  successDialog(msgKey: string, callback?: () => void, auto?: boolean, delay?: number): void;
}
