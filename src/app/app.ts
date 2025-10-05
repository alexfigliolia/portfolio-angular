import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { Ripples } from '@figliolia/ripples';
import { Menu } from 'Components/Menu';
import { NavigationButton } from 'Components/NavigationButton';
import { RouteRenderer } from 'Components/RouteRenderer';
import { ScreenLoader } from 'Components/ScreenLoader';
import { PreloadPromise } from 'Config/app.config';
import { MenuState } from 'State/MenuState';
import { NavigationState } from 'State/Navigation';
import { TaskQueue } from 'Tools/TaskQueue';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouteRenderer, ScreenLoader, NavigationButton, Menu],
  host: {
    '[class.flip]': "navigation.classes().has('flip')",
    '[class.shrink]': "navigation.classes().has('shrink')",
    '[class.hidden]': "navigation.classes().has('hidden')",
  },
})
export class App implements OnDestroy {
  private rips?: Ripples;
  readonly menu = inject(MenuState);
  readonly navigation = inject(NavigationState);
  readonly title = signal('portfolio-angular');
  readonly back = viewChild.required<ElementRef<HTMLDivElement>>('back');
  readonly front = viewChild.required<ElementRef<HTMLDivElement>>('front');
  constructor() {
    afterNextRender({
      write: () => {
        void import('@figliolia/ripples').then(({ Ripples }) => {
          this.rips = new Ripples(this.front().nativeElement, {});
        });
        void PreloadPromise.catch(console.log).finally(() => {
          this.navigation.show();
        });
      },
    });
  }

  ngOnDestroy() {
    this.rips?.destroy?.();
    TaskQueue.clearPendingTasks();
  }
}
