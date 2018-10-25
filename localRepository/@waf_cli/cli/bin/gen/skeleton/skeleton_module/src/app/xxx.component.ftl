import { Component } from '@angular/core';

/**
 * 模块壳组件
 * @export
 * @class DefaultComponent
 */
@Component({
  templateUrl: './{{module.prefix}}.component.html',
  styleUrls: ['./{{module.prefix}}.component.scss']
})
export class {{module.camelName}}Component { }
