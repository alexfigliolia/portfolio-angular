import { Component, input } from '@angular/core';
import { ThreeDButton } from 'Components/3DButton';

@Component({
  selector: 'three-d-button-with-entrance',
  templateUrl: './index.html',
  styleUrl: './index.scss',
  imports: [ThreeDButton],
})
export class ThreeDButtonWithEntrance {
  readonly text = input.required<string>();
  readonly reset = input.required<boolean>();
  readonly active = input.required<boolean>();
  readonly onClick = input.required<(e: MouseEvent) => void>();
}

export * from './ResetController';
