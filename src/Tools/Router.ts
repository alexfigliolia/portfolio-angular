import { inject, Injectable, signal, Type } from '@angular/core';
import { NavigationState } from 'State/Navigation';
import { ContentPreloader } from './ContentPreloader';
import { LazyRoute } from './LazyRoute';

@Injectable({
  providedIn: 'root',
})
export class Router {
  readonly navigation = inject(NavigationState);
  readonly renderTimeout = signal<number>(1000);
  private readonly preloadPromise?: Promise<void>;
  static readonly routes = new Map<string, LazyRoute>();
  readonly route = signal<Type<unknown> | undefined>(undefined);
  readonly activeRoute = signal<LazyRoute | undefined>(Router.defaultRegisteredRoute);
  constructor() {
    if (typeof window !== 'undefined') {
      addEventListener('hashchange', this.hashChange);
      this.preloadPromise = ContentPreloader.initialize();
    }
  }

  public static register(route: LazyRoute) {
    this.routes.set(route.hash, route);
  }

  public hashChange = () => {
    const nextRoute = this.getConfiguredRoute(this.currentRoute);
    if (!nextRoute) {
      window.location.hash = `#${Router.fallback}`;
      return;
    }
    const redirectToSelf = nextRoute === this.activeRoute();
    this.activeRoute.set(nextRoute);
    void Promise.all([
      nextRoute.preload(),
      this.navigation.flipScreen(),
      this.preloadingPromise,
    ]).then(([[Component, timeout]]) => {
      this.route.set(Component);
      this.renderTimeout.set(timeout);
      if (redirectToSelf) {
        this.navigation.initialize();
      }
    });
  };

  private getConfiguredRoute(hash: string) {
    return Router.routes.get(hash);
  }

  private get currentRoute() {
    return window.location.hash.slice(1).toLowerCase();
  }

  private static get fallback() {
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

  public get preloadingPromise() {
    return this.preloadPromise ?? ContentPreloader.initialize();
  }
}
