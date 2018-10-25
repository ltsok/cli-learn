import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { constant } from '../login.constant';
import { ContextService } from '@waf_service/context';
import { RouterService } from '@waf_service/router';
import { CacheService } from '@waf_service/cache';
import { LocalStorageService } from "@waf_service/storage";
import { LoggerService } from "@waf_service/logger";
import { I18nService } from "@waf_service/i18n";
import { TpiService, TpiLoginInput } from '@waf_service/tpi';
import * as $ from "jquery";

/**
 * 登录组件类
 * @export
 * @class DefaultComponent
 */
@Component({
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements AfterViewInit {

  /** 用户名 */
  name: string;

  /** 密码 */
  password: string;

  /** 服务器列表 */
  servers = [];

  /** 服务器 */
  selectedServer: any;

  /** 语言列表 */
  langs: Array<string> = ['CN', 'EN'];

  /** 选择语言 */
  selectedLang: string;

/**
 * 构造函数
 * @param {ContextService} context
 * @param {RouterService} router
 * @param {LoggerService} logger
 * @param {TpiService} tpi
 * @param {I18nService} i18n
 * @param {Renderer2} renderer
 * @param {LocalStorageService} local
 * @param {CacheService} cache
 * @memberof DefaultComponent
 */
constructor(private context: ContextService, private router: RouterService, private logger: LoggerService,
    private tpi: TpiService, private i18n: I18nService, private renderer: Renderer2,
    private local: LocalStorageService, private cache: CacheService) {

    // 初始化语言列表
    let curLang = this.i18n.getCurrentLang();
    if ('zh' === curLang) {
      this.selectedLang = 'CN';
    } else {
      this.selectedLang = 'EN';
    }

    // 初始化服务器下拉框
    this.initServer();

    // 初始化用户名
    this.name = this.local.getValue("last.user.name", true);
  }

  /**
   * 渲染成功
   * @memberof ShortcutComponent
   */
  ngAfterViewInit(): void {
    this.context.publish('event.templet.login.after.view.init');
  }

  /**
   * 切换语言
   * @memberof DefaultComponent
   */
  switchLang(): void {

    if ('CN' === this.selectedLang) {
      this.i18n.changeLang("en");
      this.selectedLang = 'EN';
    } else {
      this.i18n.changeLang("zh");
      this.selectedLang = 'CN';
    }
  }

  /**
   * 登录
   * @memberof DefaultComponent
   */
  onLogin(): void {

    // 显示Loading
    this.context.showLoading();

    // 获取登录信息
    let input = new TpiLoginInput();
    input.name = this.name;
    input.password = this.password;
    input.lang = ('CN' === this.selectedLang ? 'zh' : 'en');

    // 设置连接的服务端
    this.cache.setCache('server.selected', this.selectedServer.index);

    // 登录，成功后缓存配置
    this.tpi.login(input,

      // 成功回调
      () => {

        // 显示应用主界面
        $("#login").hide();
        $("#menu").show();
        $("#shortcut").show();
        $("#domain").show();
        this.router.showNameRoute(['menu', 'shortcut']);

        // 存储登录的输入
        this.local.setValue("last.user.name", this.name, true);
        this.local.setValue('last.server.selected', this.selectedServer.index, true);

        // 隐藏蒙层
        this.context.hideLoading();

        this.logger.info(constant.identifier, 'Login initialization finished.');
      },

      // 失败回调
      (desc: string) => {

        // 隐藏蒙层
        this.context.hideLoading();

        this.i18n.get(desc).subscribe((result) => {

          // 如果登录失败则显示结果描述
          this.context.errorDialog(result);
        });
      });
  }

  /**
   * 初始化服务器下拉框
   * @private
   * @memberof DefaultComponent
   */
  private initServer(): void {

    // 初始化服务器列表
    // config.ini文件必须配置正确
    this.servers = [];
    let serverIndexs: Array<string> = this.local.getJsonObj("servers", true);
    let lastServerIndex = this.local.getValue("last.server.selected", true);
    let lastServer;
    serverIndexs.forEach((serverIndex: string) => {
      let server = { index: serverIndex, label: this.local.getJsonObj(serverIndex, true)['server.ems.ip'] };
      this.servers.push(server);
      if (lastServerIndex === serverIndex) {
        lastServer = server;
      }
    });

    // 如果无法获取上次登录的服务器，则默认第一个
    if (lastServer) {
      this.selectedServer = lastServer;
    } else {
      this.selectedServer = this.servers[0];
    }
  }
}
