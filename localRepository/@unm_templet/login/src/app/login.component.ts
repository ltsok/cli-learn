import { Component, OnInit } from '@angular/core';
import { RouterService } from '@waf_service/router';
import { LoggerService } from '@waf_service/logger';
import { constant } from './login.constant';

/**
 * 登录组件：直接跳转到登录模块的default组件
 * @export
 * @class LoginComponent
 * @implements {OnInit}
 */
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  /**
   * 构造函数
   * @param {RouterService} router
   * @param {LoggerService} logger
   * @memberof LoginComponent
   */
  constructor(private router: RouterService, private logger: LoggerService) {
  }

  /**
   * 组件初始化
   * @memberof LoginComponent
   */
  ngOnInit(): void {

    this.logger.info(constant.identifier, 'Initialize main page (login).');

    // 跳转到登录模块的default组件
    this.router.showNameRoute(['login']);
  }
}
