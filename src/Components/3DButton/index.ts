import { Component, input, signal, WritableSignal } from '@angular/core';
import { TiltController } from './Controller';

@Component({
  selector: 'three-d-button',
  templateUrl: './index.html',
  styleUrl: './index.scss',
})
export class ThreeDButton extends TiltController {
  readonly text = input.required<string>();
  readonly onClick = input.required<(e: MouseEvent) => void>();
  readonly frame: WritableSignal<Partial<CSSStyleDeclaration>>;
  constructor() {
    const frame = signal({});
    super((nf) => {
      frame.set(nf);
    });
    this.frame = frame;
  }
}
