import { signal } from '@angular/core';
import { TaskQueue } from 'Tools/TaskQueue';

export class ResetController {
  public readonly reset = signal(false);
  public readonly active = signal(false);
  constructor(public delay = 3200) {}

  public activate(delay = this.delay) {
    this.active.set(true);
    TaskQueue.deferTask(() => {
      this.reset.set(true);
    }, delay);
  }
}
