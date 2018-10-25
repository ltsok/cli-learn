import {WafTNode} from '../model/waf-tnode.model';

export class WafTNodeIcon {
  name:string;
  showname:string;
  imgsrc:string;
  showimgsrc:string;
  imgstyle:any;
  public visible:boolean;
  public painted:boolean = false;
  deleted:boolean = false;
  params:any;
  realnodeicon:any;
  parent:WafTNode;
  isVisible():boolean {
    return this.visible;
  }

  isPainted():boolean {
    return this.painted;
  }
}
