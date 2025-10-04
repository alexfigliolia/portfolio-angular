import { Component, input } from '@angular/core';

@Component({
  selector: 'screen-reader-text',
  templateUrl: './index.html',
  styleUrl: './index.scss',
})
export class ScreenReaderText {
  readonly text = input.required<string>();
}
