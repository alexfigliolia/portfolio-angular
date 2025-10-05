import { Component, input } from '@angular/core';

@Component({
  selector: 'work-poster-title',
  templateUrl: './index.html',
  styleUrl: './index.scss',
})
export class Title {
  readonly length = input.required<number>();
  readonly letters = input.required<string[]>();

  public transition(delay: number) {
    return `opacity 0.5s ${delay}ms, transform 1.25s ${delay}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
  }
}
