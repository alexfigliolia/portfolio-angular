import { Injectable, signal } from '@angular/core';

@Injectable()
export class WorkState {
  public activeIndex = signal(0);

  public activate(index: number) {
    this.activeIndex.set(index);
  }
}
