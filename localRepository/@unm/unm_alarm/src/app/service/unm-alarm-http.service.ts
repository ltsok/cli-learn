import { Injectable } from "@angular/core";
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PushService } from "@waf_service/push";
import { HttpService, RequestMsg, ResponseMsg } from "@waf_service/http";


@Injectable()
export class UnmAlarmHttpService {

    constructor(private pushService: PushService, private http: HttpService) {

    }

    //查询所有网元信息
    getNEList() {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.res = '/cm/nes';
            this.http.get(request).then(
                (value: ResponseMsg) => {
                    let neList = value.content;
                    resolve(neList);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }

    //当前告警确认
    confirmCurrentAlm(alarmIdList: number[]) {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.resUrl = '/am/currentAlms/confirm';
            request.content = alarmIdList;
            this.http.put(request).then(
                (value: ResponseMsg) => {
                    console.log(value)
                    resolve(value);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }
    //当前告警反确认
    unconfirmCurrentAlm(alarmIdList: number[]) {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.resUrl = '/am/currentAlms/unconfirm';
            request.content = alarmIdList;
            this.http.put(request).then(
                (value: ResponseMsg) => {
                    console.log(value)
                    resolve(value);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }
    //当前告警清除
    clearCurrentAlm(alarmIdList: number[]) {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.resUrl = '/am/currentAlms/clear';
            request.content = alarmIdList;
            this.http.put(request).then(
                (value: ResponseMsg) => {
                    console.log(value)
                    resolve(value);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }
    //当前告警备注
    /* remarkInfo结构为：
    {
     "alarmIdList": number[];
     "remark":string;
    }*/
    remarkCurrentAlm(remarkInfo: any) {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.resUrl = '/am/currentAlms/remark';
            request.content = remarkInfo;
            this.http.put(request).then(
                (value: ResponseMsg) => {
                    console.log(value)
                    resolve(value);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }
    //当前告警确认并备注
    confirmAndRemarkCurrentAlm(alarmIdList: number[]) {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.resUrl = '/am/currentAlms/confirmAndRemark';
            request.content = alarmIdList;
            this.http.put(request).then(
                (value: ResponseMsg) => {
                    console.log(value)
                    resolve(value);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }
    //当前告警查询
    queryCurrentAlms(queryInfo: any) {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.resUrl = '/am/currentAlms';
            request.content = queryInfo;
            this.http.post(request).then(
                (value: ResponseMsg) => {
                    console.log(value)
                    resolve(value);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }

    //历史告警查询
    queryHistoryAlms(queryInfo: any) {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.resUrl = '/am/historyAlms';
            request.content = queryInfo;
            this.http.post(request).then(
                (value: ResponseMsg) => {
                    console.log(value)
                    resolve(value);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }

    //查询所有模板信息
    getAlarmTemplates() {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.res = '/am/almTemplates';
            this.http.get(request).then(
                (value: ResponseMsg) => {
                    let templates = value.content;
                    resolve(templates);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }
    //查询当前用户统计的所有模板信息
    getUserAlarmTemplates() {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.res = '/am/currentAlms/monitorTmpls';
            this.http.get(request).then(
                (value: ResponseMsg) => {
                    let templates = value.content;
                    resolve(templates);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }

    //设置当前用户告警统计所有模板
    setMonitorTempls(templateIdList: number[]) {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.resUrl = '/am/currentAlms/monitorTmpls/set';
            request.content = templateIdList;
            this.http.put(request).then(
                (value: ResponseMsg) => {
                    console.log(value)
                    resolve(value);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }
    //取消设置当前用户告警统计模板
    unsetMonitorTempls(templateIdList: number[]) {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.resUrl = '/am/currentAlms/monitorTmpls/unset';
            request.content = templateIdList;
            this.http.put(request).then(
                (value: ResponseMsg) => {
                    console.log(value)
                    resolve(value);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }
    //设置当前用户告警默认统计模板
    setCurMonitorTemplate(templateId) {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.resUrl = '/am/currentAlms/curMonitorTmpl/' + templateId + '/set';
            this.http.put(request).then(
                (value: ResponseMsg) => {
                    console.log(value)
                    resolve(value);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }

    //添加当前告警模板
    addCurrentAlmTemplate(almTemplate) {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.resUrl = '/am/almQueryTemplates/currentAlm/add';
            request.content = almTemplate;
            this.http.post(request).then(
                (value: ResponseMsg) => {
                    console.log(value)
                    resolve(value);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }

    //添加历史告警模板
    addHistoryAlmTemplate(almTemplate) {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.resUrl = '/am/almQueryTemplates/historyAlm/add';
            request.content = almTemplate;
            this.http.post(request).then(
                (value: ResponseMsg) => {
                    console.log(value)
                    resolve(value);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }

    //根据模板id查询单个模板详细信息
    getAlarmTemplateDetail(template) {

        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.res = '/am/almTemplate';
            let filter: Map<string, string> = new Map<string, string>();
            filter.set("templateId", template.templateId)
            request.filter = filter;

            this.http.get(request).then(
                (value: ResponseMsg) => {
                    console.log(value);
                    let detail = value.content;
                    resolve(detail);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }

    //查询所有告警代码信息
    getAlmTypes() {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.res = '/am/almTypes';
            this.http.get(request).then(
                (value: ResponseMsg) => {
                    let almTypes = value.content;
                    resolve(almTypes);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }

    //查询用户列表信息
    getUserList() {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.res = '/user/users/idName';
            this.http.get(request).then(
                (value: ResponseMsg) => {
                    let userList = value.content;
                    resolve(userList);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }

    //查询告警级别统计信息
    getAlmLevelStaticticData() {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.res = '/am/currentAlms/statistic/level';
            this.http.get(request).then(
                (value: ResponseMsg) => {
                    console.log(value);
                    resolve(value.content);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }
    //查询告警状态统计信息
    getAlmStatusStaticticData() {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.res = '/am/currentAlms/statistic/status';
            this.http.get(request).then(
                (value: ResponseMsg) => {
                    console.log(value);
                    resolve(value.content);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }

    //查询告警TOP-N统计信息
    getAlmTopNStaticticData() {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.res = '/am/currentAlms/statistic/top10';
            this.http.get(request).then(
                (value: ResponseMsg) => {
                    console.log(value);
                    resolve(value.content);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }



    //查询告警类型统计信息
    getAlmTypeStaticticData() {
        return new Promise((resolve, reject) => {
            let request = new RequestMsg();
            request.res = '/am/currentAlms/statistic/kind';
            this.http.get(request).then(
                (value: ResponseMsg) => {
                    console.log(value);
                    resolve(value.content);
                },
                (value: ResponseMsg) => {
                    reject();
                }
            );
        });
    }





}
