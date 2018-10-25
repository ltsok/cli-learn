import {WafTLabel} from '../model/waf-tlabel.model';
import {WafTNode} from './waf-tnode.model';

export class WafTLink {
  id: string;
  name: string;
  showname: string;
  type: number;
  status: number;
  strokecolor: string;
  curveLatLng: any;
  style: any;
  leftnode: WafTNode;
  rightnode: WafTNode;
  leftNeNode: WafTNode;
  rightNeNode: WafTNode;
  reallink: any;
  tlabel: WafTLabel;
  visible: boolean;
  painted: boolean;
  params: any;

  isVisible(): boolean {
    return this.visible;
  }

  isPainted(): boolean {
    return this.painted;
  }
}
