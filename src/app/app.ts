import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Ripples } from '@figliolia/ripples';
import { NavigationButton } from 'Components/NavigationButton';
import { ScreenLoader } from 'Components/ScreenLoader';
import { PreloadPromise } from 'Config/app.config';
import { NavigationState } from 'State/Navigation';
import { TaskQueue } from 'Tools/TaskQueue';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterOutlet, ScreenLoader, NavigationButton],
  host: {
    '[class.flip]': "navigation.classes().has('flip')",
    '[class.shrink]': "navigation.classes().has('shrink')",
    '[class.hidden]': "navigation.classes().has('hidden')",
  },
})
export class App implements OnDestroy {
  private rips?: Ripples;
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
        void PreloadPromise.catch(console.log).finally(() => this.navigation.show());
      },
    });
  }

  ngOnDestroy() {
    this.rips?.destroy?.();
    TaskQueue.clearPendingTasks();
  }
}
