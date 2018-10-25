import {WafTNode} from './waf-tnode.model';
import {WafTLink} from '../model/waf-tlink.model';

export class WafTRange {
  name:string;
  showname:string;
  realrange:any;
  tnode:WafTNode;
  links:Array<WafTLink>;
  centerLatLng:any;
  coordinate:any;
  style:any;
  visible:boolean;
  painted:boolean;
  params:any;

  isVisible():boolean {
    return this.visible;
  }

  isPainted():boolean {
    return this.painted;
  }
}


