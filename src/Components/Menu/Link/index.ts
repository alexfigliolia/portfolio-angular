import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MenuState } from 'State/MenuState';
import { NavigationState } from 'State/Navigation';
import { TaskQueue } from 'Tools/TaskQueue';

@Component({
  selector: 'menu-link',
  templateUrl: './index.html',
  styleUrl: './styles.scss',
})
export class Link {
  readonly hoverable = signal(false);
  readonly label = input<string>();
  readonly to = input.required<string>();
  readonly id = input.required<string>();
  readonly menu = inject(MenuState);
  readonly navigation = inject(NavigationState);
  readonly letters = computed(() => (this.label() ?? this.to()).toUpperCase().split(''));
  readonly delay = computed(() => this.letters().length + 50 + 2200);
  readonly active = computed(
    () => this.navigation.routeName().toLowerCase() === this.to().toLowerCase(),
  );
  constructor() {
    effect(() => {
      if (this.menu.menuOpen()) {
        this.activateHovering();
        return;
      }
      this.hoverable.set(false);
    });
  }

  public navigate() {
    this.navigation.navigateTo(this.to());
    TaskQueue.deferTask(() => {
      this.menu.toggle();
    }, NavigationState.shrinkAndFlipDuration);
  }

  private activateHovering() {
    TaskQueue.deferTask(() => {
      this.hoverable.set(true);
    }, this.delay());
  }
}
