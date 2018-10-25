import {Component, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import { HttpRequest, HttpClient, HttpEventType, HttpEvent, HttpResponse } from '@angular/common/http';
import { NzMessageService, UploadXHRArgs } from 'ng-zorro-antd';
import {HttpService, RequestMsg, ResponseMsg} from '@waf_service/http';
import {TpiGlobalService} from '@waf_service/tpi';
import {ContextService} from '@waf_service/context';
import {LoggerService} from '@waf_service/logger';
import { LocalStorageService } from "@waf_service/storage";
import * as Quill from 'quill';
import * as $ from 'jquery';
import * as saveAs from 'file-saver';
import BlotFormatter from 'quill-blot-formatter';

import {constant} from './tutorial-editor.constant';

/**
 * 模块壳组件
 * @export
 * @class TutorialEditorComponent
 */
@Component({
  selector: 'tutorial-editor',
  templateUrl: './tutorial-editor.component.html',
  styleUrls: ['./tutorial-editor.component.scss']
})
export class TutorialEditorComponent implements AfterViewInit, OnDestroy {

  @ViewChild('editor') editorDiv: ElementRef;

  /** 文档模式：true-编辑模式 false-阅读模式 */
  editorMode: boolean = false;

  /** 富编辑对象 */
  quill: any;

  /** toolbar */
  toolbar: any;

  /** 文档元素 */
  elEditor: any;

  /** 文档内容 */
  tmpContent: any;

  /** 是否有编辑权限 */
  isAuth: boolean = false;

  /** 文档id */
  _editorId: string;

  /** 锚点 */
  anchors: any = [];

  /** h1对应的h2集合 */
  childH2: any = [];

  /** 工具栏按钮大小 */
  size: string = 'default';

  /**上传word文件地址 */
  uploadUrl: string;
  
  @Input()
  set editorId(editorId: string) {
    this._editorId = editorId;
  }
  
  /** 编辑器宽度 */
  _width: string = '82%';
  @Input()
  set width(width: string) {
    this._width = width;
  }


  /**
   * 构造函数
   * @param {ContextService} context
   * @param {HttpService} http
   * @param {TpiGlobalService} tpiGlobal
   * @param {LoggerService} logger
   * @memberof TutorialEditorComponent
   */
  constructor(
    private context: ContextService,
    private http: HttpService,
    private tpiGlobal: TpiGlobalService,
    private logger: LoggerService,
    private httpClient: HttpClient,
    private local: LocalStorageService,
  ) {
    let loginUser = this.context.getLoginInfo().user;
    if (loginUser.role === 'admin') {
      this.isAuth = true;
    }
  }

  /**
   * 渲染完初始化
   * @memberof TutorialEditorComponent
   */
  ngAfterViewInit(): void {

    // 初始化quill
    this.initQuill();
  }

  /**
   * 销毁组件
   * @memberof TutorialEditorComponent
   */
  ngOnDestroy(): void {

    //编辑模式时退出组件提示是否保存
    if (this.editorMode && this.local.getValue('login.info') ) {
      this.context.confirmDialog('tutorial.editor.saveChanges', this.quitWithSave, this.quitWithoutSave);
    }

  }

  /**
   * 初始化富文本编辑器
   * @memberof TutorialEditorComponent
   */
  initQuill(): void {

    //获取编辑区元素
    this.elEditor = <HTMLElement>this.editorDiv.nativeElement;

    // 取文档数据
    let request = new RequestMsg();
    request.resUrl = '/tutorial/resources/' + this._editorId;
    this.context.showLoading();
    this.http.get(request).then((response: ResponseMsg) => {

      //toolbar配置参数
      this.toolbar = [
        [{'header': 1}, {'header': 2}],             // 标题，键值对形式；1、2表示字体大小
        [{'size': ['small', false, 'large', 'huge']}],//字体大小
        ['bold', 'italic', 'underline', 'strike'],      //加粗，斜体，下划线，删除线
        [{'color': []}, {'background': []}],        //字体颜色，字体背景颜色
        [{'script': 'sub'}, {'script': 'super'}],    //上下标
        ['blockquote', 'code-block'],                   //引用块，代码块

        [{'list': 'ordered'}, {'list': 'bullet'}],   //列表
        [{'align': []}],                              //对齐方式
        [{'indent': '-1'}, {'indent': '+1'}],        //缩进
        [{'direction': 'rtl'}],                       //文本方向
        // [{ 'font': fonts }],                            //字体

        //[{ 'header': [1, 2, 3, 4, 5, 6, false] }],      //几级标题

        ['clean'],                                      //清除字体样式

        ['link', 'image']                      //链接、上传图片、视频
      ];

      //初始化quill
      this.quill = new Quill('#tutorial-editor', {
        modules: {
          toolbar: this.toolbar
        },
        theme: 'snow'
      });

      //设置toolbar的宽度
      $('.ql-toolbar').css({'width': this._width, 'background': '#f0f2f5'});

      //为toolbar绑定滚动事件
      this.toolbarOnScroll();

      // 初始化为阅读模式
      $('.ql-toolbar').hide();
      this.quill.enable(false);
      this.editorMode = false;

      // 初始化文档内容
      this.elEditor.children[0].innerHTML = response.content;

      //关联锚点
      this.getAnchors();

      // 关闭loading
      this.context.hideLoading();

    });
  }

  /**
   * 页面滚动时固定toolbar
   * @private
   * @memberof TutorialEditorComponent
   */
  private toolbarOnScroll(): void {

    //获取要定位元素距离浏览器顶部的距离
    let navH = $('.ql-toolbar').offset().top;
    //滚动条事件
    $(window).scroll(() => {
      //获取滚动条的滑动距离
      let scroH = $(window).scrollTop();
      this.logger.debug(constant.identifier, `navH + ${navH} + scroH + ${scroH}`);
      //滚动条的滑动距离大于等于定位元素距离浏览器顶部的距离，就固定，反之就不固定
      if (scroH >= navH) {
        $('.ql-toolbar').css({
          'position': 'fixed',
          'top': '102px',
          'z-index': 99,
          'width': this._width,
          'background': '#f0f2f5'
        });
      } else if (scroH < navH) {
        $('.ql-toolbar').css({'position': 'static', 'width': '100%'});
      }
    });
  }

  /**
   * 修改文档模式
   * @private
   * @memberof TutorialEditorComponent
   */
  private onEditorMode(): void {

    if (this.editorMode) {

      // 进入阅读模式
      this.readMode();

      // 获取编辑器中的内容
      this.tmpContent = this.elEditor.children[0].innerHTML;
      //提交文档
      let request = new RequestMsg();
      request.resUrl = '/tutorial/resources/' + this._editorId;
      request.content = {content: this.tmpContent};
      this.context.showLoading();
      this.http.post(request).then(() => {

        // 进入阅读模式
        this.readMode();
        //关联锚点
        this.getAnchors();
        // 关闭loading
        this.context.hideLoading();
      });

    } else {
      // 进入编辑模式
      this.editMode();
    }
  }

  /**
   * 添加锚点
   * @private
   * @memberof TutorialEditorComponent
   */
  private addAnchor(): void {

    let range = this.quill.getSelection();
    let selectionText = '';
    if (range) {
      if (range.length == 0) {
        this.logger.info(constant.identifier, range.index);
      } else {
        //获取选取内容
        let text = this.quill.getText(range.index, range.length);
        this.quill.deleteText(range.index, range.length);
        this.logger.info(constant.identifier, `User has highlighted: ${text}`);
        selectionText = `x${text}x`;
        this.quill.insertEmbed(range.index, 'text', selectionText);

        // 获取编辑器中的内容
        let tmpContent = '' + this.elEditor.children[0].innerHTML + '';
        let anchor = `<strong id = 'components-anchor-demo-basic'>${text}<\/strong>`;
        tmpContent = tmpContent.replace(selectionText, anchor);

        //替换编辑器内容
        let length = this.quill.getLength();
        this.quill.deleteText(0, length);
        // this.quill.pasteHTML(tmpContent);
        this.elEditor.children[0].innerHTML = tmpContent;
      }
    } else {
      this.logger.info(constant.identifier, 'User cursor is not in editor');
    }
  }

  /**
   * 进入编辑模式
   * @private
   * @memberof TutorialEditorComponent
   */
  private editMode(): void {

    //销毁quill
    this.restoreQuill();
    Quill.register('modules/blotFormatter', BlotFormatter);
    this.quill = new Quill('#tutorial-editor', {
      modules: {
        toolbar: this.toolbar,
        blotFormatter: {}
      },
      theme: 'snow'
    });
    //设置toolbar的宽度
    $('.ql-toolbar').css({'width': '100%', 'background': '#f0f2f5'});

    // 获取编辑器中的内容
    this.tmpContent = this.elEditor.children[0].innerHTML;
    this.elEditor.children[0].innerHTML = this.tmpContent;

    //关联锚点
    this.getAnchors();

    $('.ql-toolbar').show();
    this.quill.enable();
    this.editorMode = true;
  }

  /**
   * 进入阅读模式
   * @private
   * @memberof TutorialEditorComponent
   */
  private readMode(): void {

    //销毁quill
    this.restoreQuill();
    this.quill = new Quill('#tutorial-editor', {
      modules: {
        toolbar: this.toolbar
      },
      theme: 'snow'
    });

    //设置toolbar的宽度
    $('.ql-toolbar').css({'width': '100%', 'background': '#f0f2f5'});

    // 获取编辑器中的内容
    this.tmpContent = this.elEditor.children[0].innerHTML;
    this.elEditor.children[0].innerHTML = this.tmpContent;

    $('.ql-toolbar').hide();
    this.quill.enable(false);
    this.editorMode = false;
  }

  /**
   * 清楚quill实例及页面内容
   * @private
   * @memberof TutorialEditorComponent
   */
  private restoreQuill(): void {
    this.quill = null;
    $('.ql-toolbar').remove();
    $('#quill').empty();
  }

  /**
   * 获取quil下所有h1、h2元素并关联锚点
   * @private
   * @memberof TutorialEditorComponent
   */
  private getAnchors(): void {

    //右侧锚点标签内容
    this.anchors = [];
    //获取h1、h2标签
    let h1_elments: Array<any> = $('#tutorial-editor h1');
    //伪数组转真数组
    h1_elments = Array.from(h1_elments);
    // let h2_elments: Array<any> = $('#tutorial-editor h2');
    if (h1_elments.length) {
      h1_elments.map((item, index, arr) => {
        item.id = 'toturial-h1' + this.getuuid();
        this.anchors.push({
          anchorId: item.id,
          anchorName: this.getTagValue(item),
          child_h2: this.getChildH2(item)
        })
      });
      this.logger.debug(constant.identifier, this.anchors);
    }
  }

  /**
   * 获取h标签内容
   * @private
   * @param {*} tags
   * @returns {*}
   * @memberof TutorialEditorComponent
   */
  private getTagValue(tags: any): any {
    if (tags.childNodes.length && tags.childNodes[0].nodeType === 1) {
      return this.getTagValue(tags.childNodes[0]);
    } else {
      return tags.innerText;
    }
  }

  /**
   * 获取h1相邻的所有h2兄弟节点
   * @private
   * @param {*} tag
   * @returns {*}
   * @memberof TutorialEditorComponent
   */
  private getChildH2(tag: any): any {
    this.childH2 = [];
    return this.getAllH2(tag);
  }

  /**
   * 递归获取所有h2元素
   * @private
   * @param {*} tag
   * @returns {*}
   * @memberof TutorialEditorComponent
   */
  private getAllH2(tag: any): any {
    if (tag && tag.nextElementSibling && tag.nextElementSibling.nodeName !== 'H1') {
      if (tag.nextElementSibling.nodeName === 'H2') {
        this.childH2.push(tag.nextElementSibling);
        return this.getAllH2(tag.nextElementSibling);
      } else {
        return this.getAllH2(tag.nextElementSibling);
      }
    } else {
      if (this.childH2.length) {
        let h2Arr = [];
        this.childH2 = Array.from(this.childH2);
        this.childH2.map((item, index, arr) => {
          item.id = 'toturial-h2' + this.getuuid();
          h2Arr.push({
            anchorId: item.id,
            anchorName: this.getTagValue(item)
          })
        });
        return h2Arr;
      } else {
        return [];
      }
    }
  }

  /**
   * 获取uuid
   * @private
   * @returns {string}
   * @memberof TutorialEditorComponent
   */
  private getuuid(): string {
    let s = [];
    let hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4';
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = '-';

    let uuid = s.join('');
    return uuid;
  }

  /**
   * 离开时保存修改
   * @private
   * @memberof TutorialEditorComponent
   */
  private quitWithSave = () => {

    // 获取编辑器中的内容
    this.tmpContent = this.elEditor.children[0].innerHTML;
    //提交文档
    let request = new RequestMsg();
    request.resUrl = '/tutorial/resources/' + this._editorId;
    request.content = {content: this.tmpContent};
    this.context.showLoading();
    this.http.post(request).then(() => {
      this.context.hideLoading();
    });
  }


  /**
   * 离开时不保存修改
   * @private
   * @memberof TutorialEditorComponent
   */
  private quitWithoutSave = () => {
    this.logger.info(constant.identifier, 'quit without save');
  }

  /**
   * 不保存退出编辑
   * @private
   * @memberof TutorialEditorComponent
   */
  private withoutSave(): void {
    this.restoreQuill();
    this.initQuill();
  }


  /**
   * 上传docx格式的word文档
   * @param {UploadXHRArgs} item
   * @memberof TutorialEditorComponent
   */
  upload = (item: UploadXHRArgs) => {

    let fileName = item.file.name;
    if ( fileName.indexOf('.docx') == -1 ) {
      this.context.errorDialog('上传的文件不合法');
      item.onError('not allowed', item.file);
      return ;
    }
    this.uploadUrl = 'http://10.170.190.45:4300/v1/tutorial/wordFiles';
    // 构建一个 FormData 对象，用于存储文件或其他参数
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    formData.append('file', item.file as any);
    formData.append('id', '1000');
    const req = new HttpRequest('POST', this.uploadUrl, formData, {
      reportProgress : true,
      withCredentials: true
    });
    // 始终返回一个 `Subscription` 对象，nz-upload 会在适当时机自动取消订阅
    this.context.showLoading();
    return this.httpClient.request(req).subscribe((event: HttpEvent<{}>) => {
      if (event.type === HttpEventType.UploadProgress) {
        if (event.total > 0) {
          // tslint:disable-next-line:no-any
          (event as any).percent = event.loaded / event.total * 100;
        }
        // 处理上传进度条，必须指定 `percent` 属性来表示进度
        item.onProgress(event, item.file);
      } else if (event instanceof HttpResponse) {
        
        // 处理成功
        item.onSuccess(event.body, item.file, event);
        this.elEditor.children[0].innerHTML = (<any>event).body.content;
        this.getAnchors();

        // 保存文档
        this.tmpContent = this.elEditor.children[0].innerHTML;
        let request = new RequestMsg();
        request.resUrl = '/tutorial/resources/' + this._editorId;
        request.content = {content: this.tmpContent};
        this.http.post(request).then(() => {
          this.context.hideLoading();
        });
        console.log(event);
      }
    }, (err) => {
      // 处理失败
      item.onError(err, item.file);
      this.context.hideLoading();
    });
  }


  /**
   * 导出word文档
   * @memberof TutorialEditorComponent
   */
  wordExport():void {

    this.context.showLoading();
    let fileName = this._editorId;
    let staticHtml = {
        mhtml: {
            top: "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>",
            head: "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n",
            body: "<body>_body_</body>"
        }
    };
    let options = {
        maxWidth: 624
    };
    // Clone selected element before manipulating it
    let markup = $('.ql-editor').clone();

    // Remove hidden elements from the output
    markup.each(function() {
        let self = $(this);
        if (self.is(':hidden'))
            self.remove();
    });

    // Embed all images using Data URLs
    let images = Array();
    let img = markup.find('img');
    for (let i = 0; i < img.length; i++) {
        // Calculate dimensions of output image
        let w = Math.min(img[i].width, options.maxWidth);
        let h = img[i].height * (w / img[i].width);
        // Create canvas for converting image to data URL
        let canvas:any = document.createElement("CANVAS");
        canvas.width = w;
        canvas.height = h;
        // Draw image to canvas
        let context = canvas.getContext('2d');
        context.drawImage(img[i], 0, 0, w, h);
        // Get data URL encoding of image
        let uri = canvas.toDataURL("image/png");
        $(img[i]).attr("src", img[i].src);
        img[i].width = w;
        img[i].height = h;
        // Save encoded image to array
        images[i] = {
            type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
            encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
            location: $(img[i]).attr("src"),
            data: uri.substring(uri.indexOf(",") + 1)
        };
    }

    // Prepare bottom of mhtml file with image data
    let mhtmlBottom = "\n";
    for (let i = 0; i < images.length; i++) {
        mhtmlBottom += "--NEXT.ITEM-BOUNDARY\n";
        mhtmlBottom += "Content-Location: " + images[i].location + "\n";
        mhtmlBottom += "Content-Type: " + images[i].type + "\n";
        mhtmlBottom += "Content-Transfer-Encoding: " + images[i].encoding + "\n\n";
        mhtmlBottom += images[i].data + "\n\n";
    }
    mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";

    //TODO: load css from included stylesheet
    let styles = "";

    // Aggregate parts of the file together
    let fileContent = staticHtml.mhtml.top.replace("_html_", staticHtml.mhtml.head.replace("_styles_", styles) + staticHtml.mhtml.body.replace("_body_", markup.html())) + mhtmlBottom;

    // Create a Blob with the file contents
    let blob = new Blob([fileContent], {
        type: "application/msword;charset=utf-8"
    });
    saveAs(blob, fileName + ".doc");
    this.logger.info('export',fileName);
    this.context.hideLoading();
  };

}
