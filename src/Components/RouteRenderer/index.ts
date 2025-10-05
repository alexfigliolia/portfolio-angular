import { Component, effect, inject, ViewContainerRef } from '@angular/core';
import { Router } from 'Tools/Router';

@Component({
  selector: 'route-renderer',
  template: '',
})
export class RouteRenderer {
  readonly router = inject(Router);
  private viewContainer = inject(ViewContainerRef);
  constructor() {
    if (typeof window !== 'undefined') {
      this.router.hashChange();
    }
    effect(() => {
      const component = this.router.route();
      if (component) {
        this.viewContainer.clear();
        this.viewContainer.createComponent(component);
      }
    });
  }
}
