import { Component, computed, input } from '@angular/core';
import { ScreenReaderText } from 'Components/ScreenReaderText';

@Component({
  selector: 'split-text',
  templateUrl: './index.html',
  styleUrl: './index.scss',
  imports: [ScreenReaderText],
})
export class SplitText {
  readonly text = input.required<string>();
  readonly tokens = computed(() => this.text().split(''));
}
