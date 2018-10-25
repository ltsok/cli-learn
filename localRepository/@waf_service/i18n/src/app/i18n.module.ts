import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoggerService } from '@waf_service/logger';
import { constant } from './i18n.constant';
import { I18nService } from './service/i18n.service';
import { I18nPipe } from './service/i18n.pipe';
export { I18nService } from './service/i18n.service';

export const TransModule: ModuleWithProviders = TranslateModule.forChild({
  loader: {
    provide: TranslateLoader,
    useFactory: (createTranslateHttpLoader),
    deps: [HttpClient]
  }
});

export function createTranslateHttpLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, constant.i18nFilePrefix, constant.i18nFileSuffix);
};

/**
 * i18n模块
 * @export
 * @class I18nModule
 */
@NgModule({
  declarations: [
    I18nPipe
  ],
  exports: [I18nPipe, TranslateModule],
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateHttpLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [{ provide: I18nService, useClass: I18nService }]
})
export class I18nModule {

  /**
   * 构造函数
   * @param {LoggerService} logger
   * @memberof I18nModule
   */
  constructor(private logger: LoggerService) {
    this.logger.info(constant.identifier, 'Initialize i18n module.');
  }
}
