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
        return [this.loaderResult, this.threshold()];
      }
      const TP = new TimedPromise(loader, this.threshold());
      const { remainingMS, result } = await TP.run();
      this.loaderResult = result;
      return [this.loaderResult, remainingMS];
    };
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
  hash: string;
  title: string;
  loaderFN: () => Promise<Type<unknown>>;
}
