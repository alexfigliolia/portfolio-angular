import { afterNextRender, inject } from '@angular/core';
import { MenuState } from 'State/MenuState';
import { NavigationState } from 'State/Navigation';
import { Router } from './Router';

export abstract class BaseRoute {
  readonly router = inject(Router);
  readonly menu = inject(MenuState);
  readonly navigation = inject(NavigationState);
  constructor(menuDelay = 3400) {
    afterNextRender({
      write: () => {
        this.navigation.initialize(this.router.renderTimeout(), () => {
          this.navigation.setRouteName(this.router.activeRoute()?.title ?? '');
        });
      },
    });
    this.menu.buttonDelay.set(menuDelay);
  }
}
