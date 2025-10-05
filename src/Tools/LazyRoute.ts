import { Type } from '@angular/core';
import { TimedPromise } from '@figliolia/promises';
import { Router } from './Router';

export class LazyRoute {
  public hash: string;
  public title: string;
  public static isInitialLoad = true;
  private loader: () => Promise<[Type<unknown>, number]>;
  private loaderResult: Type<unknown> | undefined = undefined;
  constructor({ hash, title, loaderFN }: ILazyRoute) {
    this.hash = hash;
    this.title = title;
    this.loader = this.createComponentLoader(loaderFN);
    Router.register(this);
  }

  public preload() {
    return this.loader();
  }

  private createComponentLoader(
    loader: () => Promise<Type<unknown>>,
  ): () => Promise<[Type<unknown>, number]> {
    return async () => {
      if (this.loaderResult) {
        return [this.loaderResult, LazyRoute.threshold];
      }
      const TP = new TimedPromise(loader, LazyRoute.threshold);
      const { remainingMS, result } = await TP.run();
      this.loaderResult = result;
      return [this.loaderResult, remainingMS];
    };
  }

  private static get threshold() {
    if (this.isInitialLoad) {
      this.isInitialLoad = false;
      return 0;
    }
    return 500;
  }
}

export interface ILazyRoute {
  hash: string;
  title: string;
  loaderFN: () => Promise<Type<unknown>>;
}
