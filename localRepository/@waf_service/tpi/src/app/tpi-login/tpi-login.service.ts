import { Injectable } from "@angular/core";
import { TpiLoginInput, TpiLoginOutput } from './tpi-login.model';
import { ITpiLogin } from './tpi-login.interface';
import { constant } from '../tpi.constant';
import { LoggerService } from "@waf_service/logger";

/**
 * 登录哑服务
 * @export
 * @class DummyLoginService
 * @implements {ITpiLogin}
 */
@Injectable()
export class DummyLoginService implements ITpiLogin {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof DummyLoginService
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize tpi-login-dummy service.');
  }

  /**
   * 哑登录
   * @param {TpiLoginInput} input
   * @returns {Promise<TpiLoginOutput>}
   * @memberof DummyLoginService
   */
  login(input: TpiLoginInput): Promise<TpiLoginOutput> {

    return new Promise((resolve, reject) => {
      let output = new TpiLoginOutput();
      output.token = 'dummy-login-token';
      output.user = { name: 'dummy-login-user' };
      resolve(output);
    });
  }

  /**
   * 哑退出
   * @returns {Promise<string>}
   * @memberof DummyLoginService
   */
  logout(): Promise<string> {

    return new Promise((resolve, reject) => {
      resolve('dummy-logout');
    });
  }
}
