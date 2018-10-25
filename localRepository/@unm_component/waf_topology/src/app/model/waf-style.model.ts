import {WafMapStyle} from './waf-mapstyle.model';
import {WafNodeStyle} from './waf-nodestyle.model';
import {WafLinkStyle} from './waf-linkstyle.model';
import {WafRangeStyle} from './waf-rangestyle.model';
import {WafLabelStyle} from './waf-labelstyle.model';

export class WafTopoStyle {
  mapStyle:WafMapStyle;
  nodeStyle:WafNodeStyle;
  linkStyle:WafLinkStyle;
  rangeStyle:WafRangeStyle;
  labelStyle:WafLabelStyle;
}
