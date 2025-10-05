import { Component, computed, effect, input, OnDestroy, signal } from '@angular/core';
import { CancelFN } from '@figliolia/task-queue';
import { ThreeDButton } from 'Components/3DButton';
import { TaskQueue } from 'Tools/TaskQueue';
import { IPosterData } from '../types';

@Component({
  selector: 'work-poster-content',
  templateUrl: './index.html',
  styleUrl: './index.scss',
  imports: [ThreeDButton],
})
export class Content implements OnDestroy {
  private cancelFN?: CancelFN;
  readonly reset = signal(false);
  readonly expanded = signal(false);
  readonly delay = input.required<number>();
  readonly active = input.required<boolean>();
  readonly data = input.required<IPosterData>();
  readonly transitionDelay = computed(() => `${this.active() ? this.delay() : 0}ms`);
  constructor() {
    this.handleButtonResets();
  }

  public toggle = () => {
    this.expanded.update((v) => !v);
  };

  public visit = () => {
    window.open(this.data().url, '_blank');
  };

  public ngOnDestroy() {
    this.cancelFN?.();
  }

  private handleButtonResets() {
    effect(() => {
      if (this.active()) {
        this.cancelFN = TaskQueue.deferTask(() => {
          this.reset.set(true);
        }, this.delay() + 2200);
      } else {
        this.cancelFN?.();
        this.reset.set(false);
      }
    });
  }
}
