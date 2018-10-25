import { Injectable } from "@angular/core";
import { Http, Response, Headers } from '@angular/http';
import { LoggerService } from '@waf_service/logger';
import { CacheService } from '@waf_service/cache';
import { LocalStorageService } from "@waf_service/storage";
import { TpiGlobalService } from '@waf_service/tpi';
import { I18nService } from '@waf_service/i18n';
import { constant } from '../http.constant';
import { RequestMsg, ResponseMsg, MSG, ResultCodeType } from './http.service.smodel';

/**
 * http(s)服务
 * @export
 * @class HttpService
 */
@Injectable()
export class HttpService {

  /**
   * 构造函数
   * @param {Http} http
   * @param {TpiGlobalService} tpiGlobal
   * @param {LoggerService} logger
   * @param {CacheService} cache
   * @param {I18nService} i18n
   * @param {LocalStorageService} local
   * @memberof HttpService
   */
  constructor(private http: Http, private tpiGlobal: TpiGlobalService,
    private logger: LoggerService, private cache: CacheService,
    private i18n: I18nService, private local: LocalStorageService) {

    this.logger.info(constant.identifier, 'Initialize http service.');
  }

  /**
   * 发送get消息
   * @param {RequestMsg} request
   * @returns {(Promise<ResponseMsg | any>)}
   * @memberof HttpService
   */
  get(request: RequestMsg): Promise<ResponseMsg | any> {
    this.logger.debug(constant.identifier, request, 'get');
    return this.http.get(this.getUrl(request), { headers: this.getHeaders(request) })
      .toPromise().then(
      (response: Response) => this.doSucc(response, request),
      (error: Response) => this.doFail(error, request)
      )
  }

  /**
   * 发送post消息
   * @param {RequestMsg} request
   * @returns {(Promise<ResponseMsg | any>)}
   * @memberof HttpService
   */
  post(request: RequestMsg): Promise<ResponseMsg | any> {
    this.logger.debug(constant.identifier, request, 'post' + request.id);
    return this.http.post(this.getUrl(request), JSON.stringify(request.content), { headers: this.getHeaders(request) })
      .toPromise().then(
      (response: Response) => this.doSucc(response, request),
      (error: Response) => this.doFail(error, request)
      );
  }

  /**
   * 发送put消息
   * @param {RequestMsg} request
   * @returns {(Promise<ResponseMsg | any>)}
   * @memberof HttpService
   */
  put(request: RequestMsg): Promise<ResponseMsg | any> {
    this.logger.debug(constant.identifier, request, 'put' + request.id);
    return this.http.put(this.getUrl(request), JSON.stringify(request.content), { headers: this.getHeaders(request) })
      .toPromise().then(
      (response: Response) => this.doSucc(response, request),
      (error: Response) => this.doFail(error, request)
      );
  }

  /**
   * 发送patch消息
   * @param {RequestMsg} request
   * @returns {(Promise<ResponseMsg | any>)}
   * @memberof HttpService
   */
  patch(request: RequestMsg): Promise<ResponseMsg | any> {
    this.logger.debug(constant.identifier, request, 'patch' + request.id);
    return this.http.patch(this.getUrl(request), JSON.stringify(request.content), { headers: this.getHeaders(request) })
      .toPromise().then(
      (response: Response) => this.doSucc(response, request),
      (error: Response) => this.doFail(error, request)
      );
  }

  /**
   * 发送delete消息
   * @param {RequestMsg} request
   * @returns {(Promise<ResponseMsg | any>)}
   * @memberof HttpService
   */
  delete(request: RequestMsg): Promise<ResponseMsg | any> {
    this.logger.debug(constant.identifier, request, 'delete' + request.id);
    return this.http.delete(this.getUrl(request), { headers: this.getHeaders(request) })
      .toPromise().then(
      (response: Response) => this.doSucc(response, request),
      (error: Response) => this.doFail(error, request)
      );
  }

  /**
   * 处理http成功（包含应用成功和应用错误的处理）
   * @private
   * @param {Response} response
   * @param {RequestMsg} request
   * @returns {Promise<ResponseMsg>}
   * @memberof HttpService
   */
  private doSucc(response: Response, request: RequestMsg): Promise<ResponseMsg | any> {

    this.logger.debug(constant.identifier, response, 'response' + request.id);
    return new Promise((resolve, reject) => {

      // 如果响应结构符合（isDefRespProcess控制）默认结构则进行默认处理，否则直接返回响应内容由调用端处理
      if (request.isDefRespProcess) {

        let responseMsg: ResponseMsg = response.json();
        if (responseMsg.result.code === MSG.succ) {

          // 应用成功
          resolve(responseMsg);
        } else {

          // 打印错误日志
          this.logger.error(constant.identifier, responseMsg);

          // 错误信息
          if (request.isDefErrProcess) {

            //  设置结果码类型
            let resultType = responseMsg.result.type;
            if (!resultType) {
              resultType = ResultCodeType.server;
            }

            // 弹出错误
            this.tpiGlobal.getGlobalService().errorDialog(responseMsg.result.code + '|' + resultType + ' : ' + responseMsg.result.desc);
          } else {
            reject(responseMsg);
          }
        }
      } else {

        // 消息成功，调用方判断应用是否成功
        resolve(response.json());
      }
    });
  }

  /**
   * 处理http错误
   * @private
   * @param {Response} error
   * @param {RequestMsg} request
   * @returns {Promise<ResponseMsg>}
   * @memberof HttpService
   */
  private doFail(error: Response, request: RequestMsg): Promise<ResponseMsg> {

    // 构造http错误的响应对象
    let responseMsg = new ResponseMsg();
    responseMsg.result.code = String(error.status);
    this.i18n.get('http.error').subscribe((result: string) => responseMsg.result.desc = result);

    return new Promise((resolve, reject) => {

      // 打印错误日志
      this.logger.error(constant.identifier, error);

      // 弹出错误信息
      if (request.isDefErrProcess) {
        this.tpiGlobal.getGlobalService().errorDialog(responseMsg.result.code + ' : ' + responseMsg.result.desc);
      } else {
        reject(responseMsg);
      }
    });
  }
  /**
   * 获取全URL
   * @private
   * @param {RequestMsg} request
   * @returns {string}
   * @memberof HttpService
   */
  private getUrl(request: RequestMsg): string {

    // 1.如果请求中设置了resUrl，则以resUrl拼接完整的url,否则使用res和resParams拼接完整的url
    // 2.如果请求中设置了version，则以version拼接完整的url，否则使用全局默认的版本拼接完整的url
    // 3.如果请求中设置了filter，则将其拼接到完整的url中，否则不处理
    let resUrl = request.resUrl ? request.resUrl : this.getResUrl(request.res, request.resParams);
    let version = request.version ? request.version : this.getServerVersion();
    let filter = request.filter.size > 0 ? this.getFilter(request.filter) : '';

    // 如果请求和系统中都没有配置版本则在
    let url = '';
    if (version) {
      url = encodeURI(this.getServerUrl() + '/' + version + resUrl + filter);
    } else {
      url = encodeURI(this.getServerUrl() + resUrl + filter);
    }
    return url;
  }

  /**
   * 获取资源URL
   * @private
   * @param {string} res
   * @param {Map<string, string>} resParams
   * @returns {string}
   * @memberof HttpService
   */
  private getResUrl(res: string, resParams: Map<string, string>): string {

    // 获取资源url
    let resUrl = res;

    // 替换变量
    resParams.forEach((value: string, key: string) => {
      resUrl.replace('{{' + key + '}}', value);
    });

    return resUrl;
  }

  /**
   * 获取过滤参数
   * @private
   * @param {Map<string, string>} filter
   * @returns {string}
   * @memberof HttpService
   */
  private getFilter(filter: Map<string, string>): string {

    let strFilter = [];
    filter.forEach((value: string, key: string) => {
      strFilter.push(key + '=' + value);
    });
    return '?' + strFilter.join('&');
  }

  /**
   * 获取头参数
   * @private
   * @param {RequestMsg} request
   * @returns {Headers}
   * @memberof HttpService
   */
  private getHeaders(request: RequestMsg): Headers {

    // 设置默认值
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Token', this.cache.getCache("token"));

    // 转换请求中的头信息
    request.header.forEach((value: string, key: string) => {
      headers.append(key, value);
    });

    return headers;
  }

  /**
  * 获取服务端url
  * @private
  * @returns {string}
  * @memberof HttpService
  */
  public getServerUrl(): string {
    return this.getServerProtocol() + '://' + this.getServerHost() + this.getServerPath();
  }

  /**
   * 获取当前选择连接的服务器信息
   * @private
   * @returns {*}
   * @memberof HttpService
   */
  private getCurServerInfo(): any {
    return this.local.getJsonObj(this.cache.getCache('server.selected'), true);
  }

  /**
   * 获取服务版本
   * @private
   * @returns {string}
   * @memberof HttpService
   */
  public getServerVersion(): string {

    // 获取配置的服务版本
    let version = this.getCurServerInfo()['server.version'];

    // 如果没有配置服务版本，则返回默认值
    if (version) {
      return version;
    } else {
      return 'v1';
    }
  }

  /**
   * 获取服务端的host
   * @private
   * @returns {string}
   * @memberof HttpService
   */
  private getServerProtocol(): string {

    // 获取配置的服务协议类型
    let protocol = this.getCurServerInfo()['server.protocol'];

    // 如果没有配置服务协议类型，则返回默认值
    if (protocol) {
      return protocol;
    } else {
      return 'http';
    }
  }

  /**
   * 获取服务端的host
   * @private
   * @returns {string}
   * @memberof HttpService
   */
  private getServerHost(): string {

    // 获取配置的ip和端口
    let ip = this.getCurServerInfo()['server.ip'];
    let port = this.getCurServerInfo()['server.port'];

    // 如果没有配置ip和端口 或者 配置为空，则返回默认和前端的host一样，否则使用配置中host
    if (ip && port) {
      return ip + ':' + port;
    } else {
      return document.location.host;
    }
  }

  /**
   * 获取服务路径
   * @private
   * @returns {string}
   * @memberof HttpService
   */
  private getServerPath(): string {

    // 获取配置的服务路径
    let path = this.getCurServerInfo()['server.path'];

    // 如果没有配置服务路径，则返回默认值
    if (path) {
      return path;
    } else {
      return '';
    }
  }
}
