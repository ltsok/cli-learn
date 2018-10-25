import { ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle } from '@angular/router';


export class CustomReuseStrategy implements RouteReuseStrategy {

  handlers: { [key: string]: DetachedRouteHandle } = {};

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    console.log('CustomReuseStrategy:shouldDetach', route);
    return true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    console.log('CustomReuseStrategy:store', route, handle);
    this.handlers[route.routeConfig.path] = handle;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    console.log('CustomReuseStrategy:shouldAttach', route);
    return !!route.routeConfig && !!this.handlers[route.routeConfig.path];
  }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    console.log('CustomReuseStrategy:retrieve', route);
    return this.handlers[route.routeConfig.path];//从暂存处取回

  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    //在此处可以取得跳转前和跳转后的路由路径
    console.log('CustomReuseStrategy:shouldReuseRoute', future, curr);
    return future.routeConfig === curr.routeConfig;
  }
}
