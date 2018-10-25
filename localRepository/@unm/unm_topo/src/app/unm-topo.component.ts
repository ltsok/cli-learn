import { Component } from '@angular/core';
import { UnmTopoModel } from './model/unm-topo.model';
import { WafDropdownComponent } from "@waf_component/waf_dropdown";
import { HttpService, RequestMsg } from '@waf_service/http';
import { TpiGlobalService } from "@waf_service/tpi";
/**
 * 模块壳组件
 * @export
 * @class DefaultComponent
 */
@Component({
  templateUrl: './unm-topo.component.html',
  styleUrls: ['./unm-topo.component.scss']
})
export class UnmTopoComponent {
  constructor(private http: HttpService, private tpi: TpiGlobalService) {

  }
}
