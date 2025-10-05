import { afterNextRender, inject, InputSignal } from '@angular/core';
import { MenuState } from 'State/MenuState';
import { NavigationState } from 'State/Navigation';

export abstract class BaseRoute {
  readonly menu = inject(MenuState);
  abstract readonly title: InputSignal<string>;
  abstract readonly timeout: InputSignal<number>;
  readonly navigation = inject(NavigationState);
  constructor(menuDelay = 3400) {
    afterNextRender({
      write: () => {
        this.navigation.initialize(this.timeout(), () => {
          this.navigation.setRouteName(this.title());
        });
      },
    });
    this.menu.buttonDelay.set(menuDelay);
  }
}
