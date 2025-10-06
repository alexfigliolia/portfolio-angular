import { Component, ElementRef, input, OnDestroy, signal, viewChild } from '@angular/core';
import { CircleLoader } from 'Components/CircleLoader';
import { SplitText } from 'Components/SplitText';
import { IExperiment, MediaPreloader } from './MediaPreloader';

@Component({
  selector: 'experiment',
  templateUrl: './index.html',
  styleUrl: './styles.scss',
  imports: [SplitText, CircleLoader],
  host: {
    'attr.role': 'button',
    'attr.tabindex': '0',
    '[class.ready]': 'preloader.preloadedVideo()',
    '[class.loading]': 'loadingScene()',
    '(click)': 'onClick()',
    '(touchend)': 'onMouseOut()',
    '(mouseleave)': 'onMouseOut()',
    '(mouseenter)': 'preloader.mouseOverPreloader()',
    '(touchstart)': 'preloader.mouseOverPreloader()',
  },
})
export class Experiment implements OnDestroy {
  readonly loadingScene = signal(false);
  readonly data = input.required<IExperiment>();
  private timeout: ReturnType<typeof setTimeout> | null = null;
  readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  readonly preloader = new MediaPreloader(this.data, this.video);

  public onMouseOut = () => {
    this.video().nativeElement.pause();
  };

  public ngOnDestroy(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  public onClick = () => {
    this.loadingScene.set(true);
    this.timeout = setTimeout(() => {
      // Labs.activateScene(scene);
    }, 500);
  };
}
