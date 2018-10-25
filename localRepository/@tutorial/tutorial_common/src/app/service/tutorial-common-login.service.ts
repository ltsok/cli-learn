import { Injectable } from "@angular/core";
import { ITpiLogin, TpiLoginInput, TpiLoginOutput } from '@waf_service/tpi';
import { HttpService, RequestMsg, ResponseMsg } from '@waf_service/http';
import { CacheService } from '@waf_service/cache';

@Injectable()
export class TutorialLoginService implements ITpiLogin {

  constructor(private cache:CacheService, private http: HttpService) {

  }

  login(input: TpiLoginInput): Promise<TpiLoginOutput> {

    return new Promise((resolve, reject) => {

      let request = new RequestMsg();
      request.resUrl = '/tutorial/login';
      request.content = { name: input.name, password: input.password };
      this.http.post(request).then(
        (value: ResponseMsg) => {
          let output = new TpiLoginOutput();
          output.token = value.content.token;
          output.user = value.content.user;
          resolve(output);
        },
        (value: ResponseMsg) => {
          reject();
        }
      );
    });
  }

  logout(): Promise<string> {

    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}
