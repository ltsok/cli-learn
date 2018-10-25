import { Injectable } from '@angular/core';
import { CanDeactivate, CanActivate } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate: () => Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
