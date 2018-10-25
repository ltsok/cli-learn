import { Injectable } from "@angular/core";
import { LoggerService } from '@waf_service/logger';
import { constant } from '../theme.constant';
import { EventService } from "@waf_service/event";

/**
 * theme服务类
 * @export
 * @class ThemeService
 */
@Injectable()
export class ThemeService {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof ThemeService
   */
  constructor(private logger: LoggerService, private event: EventService) {
    this.logger.info(constant.identifier, "Initialize theme service.");
  }

  /**
   * 修改当前使用的主题
   * @param {string} theme
   * @memberof ThemeService
   */
  changeTheme(theme: string): void {

    this.logger.debug(constant.identifier, theme, "change-theme");

    // 修改主题css文件
    let themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
    themeLink.href = 'assets/themes/' + theme + '/' + theme + '.css';

    // 发布主题修改事件
    this.event.publish('event.service.theme.change.theme', { theme: theme });
  }
}
