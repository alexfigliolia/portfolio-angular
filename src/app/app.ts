import {
  afterNextRender,
  Component,
  ElementRef,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Ripples } from '@figliolia/ripples';
import { NavigationButton } from 'Components/NavigationButton';
import { ScreenLoader } from 'Components/ScreenLoader';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterOutlet, ScreenLoader, NavigationButton],
})
export class App implements OnDestroy {
  private rips?: Ripples;
  protected readonly title = signal('portfolio-angular');
  readonly back = viewChild.required<ElementRef<HTMLDivElement>>('back');
  readonly front = viewChild.required<ElementRef<HTMLDivElement>>('front');
  constructor() {
    afterNextRender({
      write: () => {
        void import('@figliolia/ripples').then(({ Ripples }) => {
          this.rips = new Ripples(this.front().nativeElement, {});
        });
      },
    });
  }

  ngOnDestroy() {
    this.rips?.destroy?.();
  }
}
