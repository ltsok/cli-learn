import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterService } from '@waf_service/router';
import * as $ from "jquery";
import { TpiService, TpiMenuItem } from '@waf_service/tpi';
import { ContextService } from "@waf_service/context";

/**
 * 模块壳组件
 * @export
 * @class DefaultComponent
 */
@Component({
  templateUrl: './shortcut.component.html',
  styleUrls: ['./shortcut.component.scss']
})
export class ShortcutComponent implements OnInit, AfterViewInit {

  /** 快捷菜单 */
  shortcutItems: TpiMenuItem[];

  /** 监控面板：组号-组下菜单节点 */
  svMap: Map<number, TpiMenuItem[]> = new Map<number, TpiMenuItem[]>();

  /** 监控面板：菜单项ID-监控数字 */
  svNumMap: Map<number, number> = new Map<number, number>();

  /** 监控面板：菜单项ID-闪烁 */
  svFlashMap: Map<number, boolean> = new Map<number, boolean>();

  /** 组件 */
  component: any;

  /** 组件是否显示 */
  isVisibleComp: boolean = false;

  /** 用户名 */
  userName: string;

  /** 缩略用户名 */
  shortUserName: string;

  /**
   * 构建函数
   * @param {Router} router
   * @param {ContextService} context
   * @param {TpiService} tpi
   * @memberof MenuComponent
   */
  constructor(private router: RouterService, private context: ContextService,
    private tpi: TpiService) {
  }

  /**
   * 初始化
   * @memberof ShortcutComponent
   */
  ngOnInit(): void {

    // 初始化快捷区域
    this.initShortcut();

    // 初始化监控区域
    this.initSupervisory();

    // 订阅退出登录事件
    this.context.subscribe('event.service.tpi.logout', () => {
      return new Promise((resolve, reject) => {

        // 显示登录页面
        this.router.navigate(null)
          .then(() => {
            $("#menu").hide();
            $("#shortcut").hide();
            $("#domain").hide();
            $("#login").show();
            this.router.hideNameRoute(["menu", "shortcut", "submenu"]);
          });

        resolve();
      });
    });
  }

  /**
   * 渲染成功
   * @memberof ShortcutComponent
   */
  ngAfterViewInit(): void {
    this.context.publish('event.templet.shortcut.after.view.init');
  }

  /**
   * 初始化快捷区域
   * @private
   * @memberof ShortcutComponent
   */
  private initShortcut() {
    this.shortcutItems = this.tpi.getShortcutMenuItems();

    let userInfo = this.context.getLoginInfo().user;
    if (userInfo && userInfo.name) {
      this.userName = userInfo.name;
      if (this.userName.length > 5) {
        this.shortUserName = this.userName.substring(0, 5) + '...';
      } else {
        this.shortUserName = this.userName;
      }
    }
  }

  /**
   * 点击快捷的事件
   * @param {TpiMenuItem} item
   * @memberof ShortcutComponent
   */
  onClickShortcut(item: TpiMenuItem): void {
    this.router.navigate(item);
  }

  /**
   * 退出系统
   * @memberof ShortcutComponent
   */
  onClickLogout(): void {

    this.context.getI18n('shortcut.logout').subscribe((result: string) => {

      // 用户确认后退出登录
      this.context.confirmDialog("shortcut.confirm.logout",

        () => {
          // 发送退出登录请求
          this.tpi.logout();
        });
    });
  }

  /**
   * 初始化监控区域
   * @private
   * @memberof ShortcutComponent
   */
  private initSupervisory() {

    // 进行分组并初始化数量
    this.tpi.getSupervisoryMenuItems().forEach((svMenuItem: TpiMenuItem) => {

      let groupNo = svMenuItem.svGroupNo;
      if (undefined == this.svMap.get(groupNo)) {

        let svMenuItems: TpiMenuItem[] = [svMenuItem];
        this.svMap.set(groupNo, svMenuItems);

      } else {

        let svMenuItems: TpiMenuItem[] = this.svMap.get(groupNo);
        svMenuItems.push(svMenuItem);
        this.svMap.set(groupNo, svMenuItems);
      }

      this.svNumMap.set(svMenuItem.id, -1);
      this.svFlashMap.set(svMenuItem.id, false);
    });

    // 订购监控事件
    this.context.subscribe("event.service.tpi.shortcut.supervisory", (event: any) => {
      return new Promise((resolve, reject) => {

        if (event && event.svNumInfo) {
          event.svNumInfo.forEach((value: number, key: number) => {
            this.svNumMap.set(key, value);
          });
        }

        if (event && event.svFlashInfo) {
          event.svFlashInfo.forEach((value: boolean, key: number) => {
            this.svFlashMap.set(key, value);
          });
        }
        resolve();
      });
    });
  }

  /**
   * 点击监控的事件
   * @param {TpiMenuItem} item
   * @memberof ShortcutComponent
   */
  onClickSupervisory(item: TpiMenuItem): void {

    if (item.component) {
      this.component = item.component;
      this.isVisibleComp = true;
    } else {
      this.router.navigate(item);
    }
  }

  /**
   * 弹出组件确认事件
   */
  onOKComp(): void {
    this.isVisibleComp = false;
  }

  /**
   * 弹出组件取消事件
   */
  onCancelComp(): void {
    this.isVisibleComp = false;
  }
}
