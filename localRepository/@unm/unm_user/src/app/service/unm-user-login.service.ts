import { Injectable } from "@angular/core";
import { ITpiLogin, TpiLoginInput, TpiLoginOutput } from '@waf_service/tpi';
import { HttpService, RequestMsg, ResponseMsg } from '@waf_service/http';


@Injectable()
export class UnmUserLoginService implements ITpiLogin {

    constructor(private http: HttpService) {

    }

    login(input: TpiLoginInput): Promise<TpiLoginOutput> {

        return new Promise((resolve, reject) => {

            let request = new RequestMsg();
            request.resUrl = '/user/login';
            request.content = {
                name: input.name,
                pwd: input.password
            };
            console.log(request);
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
