import { inject, Injectable, signal, Type } from '@angular/core';
import { NavigationState } from 'State/Navigation';
import { LazyRoute } from './LazyRoute';

@Injectable({
  providedIn: 'root',
})
export class Router {
  readonly navigation = inject(NavigationState);
  readonly renderTimeout = signal<number>(1000);
  static readonly routes = new Map<string, LazyRoute>();
  readonly route = signal<Type<unknown> | undefined>(undefined);
  readonly activeRoute = signal<LazyRoute | undefined>(Router.defaultRegisteredRoute);
  constructor() {
    if (typeof window !== 'undefined') {
      addEventListener('hashchange', this.hashChange);
    }
  }

  public static register(route: LazyRoute) {
    this.routes.set(route.hash, route);
  }

  public hashChange = () => {
    const nextRoute = this.getConfiguredRoute(this.currentRoute);
    this.activeRoute.set(nextRoute);
    void Promise.all([nextRoute.preload(), this.navigation.flipScreen()]).then(
      ([[Component, timeout]]) => {
        this.route.set(Component);
        this.renderTimeout.set(timeout);
      },
    );
  };

  private getConfiguredRoute(hash: string) {
    return Router.routes.get(hash) ?? Router.defaultRegisteredRoute;
  }

  private get currentRoute() {
    return window.location.hash.slice(1).toLowerCase() || Router.defaultRoute;
  }

  private static get defaultRoute() {
    for (const [hash] of this.routes) {
      return hash;
    }
    throw new Error('No routes registered');
  }

  private static get defaultRegisteredRoute() {
    for (const [_, route] of this.routes) {
      return route;
    }
    throw new Error('No routes registered');
  }
}
