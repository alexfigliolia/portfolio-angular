import { Type } from '@angular/core';
import { Route } from '@angular/router';
import { TimedPromise } from '@figliolia/promises';

export class LazyRoute implements Route {
  public path: string;
  public title: string;
  public static isInitialLoad = true;
  public resolve = {
    title: this.resolveTitle(),
    timeout: this.resolveTransitionTimeout(),
  };
  public loadComponent: () => Promise<Type<unknown>>;
  private loaderResult: Type<unknown> | undefined = undefined;
  constructor({ path, title, loaderFN }: ILazyRoute) {
    this.path = path;
    this.title = title;
    this.loadComponent = this.createComponentLoader(loaderFN);
  }

  public preload() {
    return this.loadComponent();
  }

  private createComponentLoader(loader: () => Promise<Type<unknown>>) {
    return async () => {
      this.loaderResult ??= await loader();
      return this.loaderResult;
    };
  }

  private resolveTransitionTimeout() {
    return async () => {
      const TP = new TimedPromise(this.loadComponent, this.threshold());
      const { remainingMS } = await TP.run();
      return remainingMS;
    };
  }

  private resolveTitle() {
    return () => Promise.resolve(this.title);
  }

  private threshold() {
    if (LazyRoute.isInitialLoad) {
      LazyRoute.isInitialLoad = false;
      return 1750;
    }
    return 1000;
  }
}

export interface ILazyRoute {
  path: string;
  title: string;
  loaderFN: () => Promise<Type<unknown>>;
}
