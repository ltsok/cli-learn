import { TpiLoginInput, TpiLoginOutput } from './tpi-login.model'

/**
 * 登录接口
 * @export
 * @interface ITpiLogin
 */
export interface ITpiLogin {

  /**
   * 登录
   * @param {TpiLoginInput} input
   * @returns {Promise<TpiLoginOutput>}
   * @memberof ITpiLogin
   */
  login(input: TpiLoginInput): Promise<TpiLoginOutput>;

  /**
   * 退出
   * @returns {Promise<string>}
   * @memberof ITpiLogin
   */
  logout(): Promise<string>;
}
