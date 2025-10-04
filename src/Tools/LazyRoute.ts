import { Route } from '@angular/router';

export class LazyRoute implements Route {
  constructor(
    public path: string,
    public loadComponent: NonNullable<Route['loadComponent']>,
  ) {}

  public preload() {
    return this.loadComponent();
  }
}
