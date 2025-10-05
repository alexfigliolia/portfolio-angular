import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Variables } from 'Styles/Variables';
import { TaskQueue } from 'Tools/TaskQueue';
import { MenuState } from './MenuState';

@Injectable({
  providedIn: 'root',
})
export class NavigationState {
  readonly router = inject(Router);
  readonly loading = signal(true);
  readonly menu = inject(MenuState);
  readonly routeName = signal('Home');
  readonly screenActive = signal(false);
  readonly classes = signal(new Set<string>(['shrink', 'flip', 'hidden']));

  static screenInnerTransition = NavigationState.sliceUnits(Variables.screenInnerTransition);
  static smallScreenScale = NavigationState.sliceUnits(Variables.smallScreenScale);
  static largeScreenScale = NavigationState.sliceUnits(Variables.largeScreenScale);

  public show() {
    console.log(this.router);
    this.removeClass('hidden');
  }

  public navigateTo(path: string) {
    // TODO - fire preloader while flipping
    void this.flipScreen().then(() => this.router.navigate([path]));
  }

  public initialize(wait = 1000, cb?: () => void) {
    TaskQueue.deferTask(() => {
      this.unFlip();
      this.loading.set(false);
      TaskQueue.deferTask(() => {
        this.unShrink();
        TaskQueue.deferTask(() => {
          this.activateScreen();
          cb?.();
        }, NavigationState.shrinkDuration);
      }, NavigationState.screenInnerTransition);
    }, wait);
  }

  public shrink() {
    this.addClass('shrink');
  }

  public unShrink() {
    this.removeClass('shrink');
  }

  public flip() {
    this.addClass('flip');
  }

  public unFlip() {
    this.removeClass('flip');
  }

  private flipScreen() {
    return new Promise<void>((resolve) => {
      this.loading.set(true);
      this.shrink();
      TaskQueue.deferTask(() => {
        this.flip();
        TaskQueue.deferTask(() => {
          this.menu.close();
          this.activateScreen(false);
          resolve();
        }, NavigationState.screenInnerTransition);
      }, NavigationState.shrinkDuration);
    });
  }

  private activateScreen(active = true) {
    this.screenActive.set(active);
  }

  public setRouteName(hash: string) {
    this.routeName.set(hash);
  }

  public static get shrinkAndFlipDuration() {
    return this.shrinkDuration + this.screenInnerTransition;
  }

  private static get shrinkDuration() {
    if (window.innerWidth < 957) {
      return this.smallScreenScale;
    }
    return this.largeScreenScale;
  }

  private static sliceUnits(duration: string) {
    return parseInt(duration.slice(0, -2));
  }

  private removeClass(className: string) {
    const clone = new Set(this.classes());
    clone.delete(className);
    this.classes.set(clone);
  }

  private addClass(className: string) {
    const clone = new Set(this.classes());
    clone.add(className);
    this.classes.set(clone);
  }
}
