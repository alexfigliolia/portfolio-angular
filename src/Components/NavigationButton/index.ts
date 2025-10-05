import { Component, effect, inject, signal } from '@angular/core';
import { CancelFN } from '@figliolia/task-queue';
import { Burger } from 'Components/Burger';
import { MenuState } from 'State/MenuState';
import { NavigationState } from 'State/Navigation';
import { TaskQueue } from 'Tools/TaskQueue';

@Component({
  selector: 'navigation-button',
  templateUrl: './index.html',
  styleUrl: './styles.scss',
  imports: [Burger],
  host: {
    '[class.active]': 'active()',
  },
})
export class NavigationButton {
  readonly active = signal(false);
  protected menu = inject(MenuState);
  private navigation = inject(NavigationState);
  constructor() {
    this.synchronize();
  }

  private synchronize() {
    effect((cleanup) => {
      const delay = this.menu.buttonDelay();
      const buttonActive = this.active();
      const screenActive = this.navigation.screenActive();
      if (!screenActive && buttonActive) {
        this.active.set(false);
        return;
      }
      let cancelFN: CancelFN;
      if (screenActive && !buttonActive) {
        cancelFN = TaskQueue.deferTask(() => {
          this.active.set(true);
        }, delay);
      }
      cleanup(() => {
        cancelFN?.();
      });
    });
  }
}
