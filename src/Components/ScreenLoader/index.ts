import { Component } from '@angular/core';
import { Loader } from 'Components/Loader';
import { ScreenReaderText } from 'Components/ScreenReaderText';

@Component({
  selector: 'screen-loader',
  templateUrl: './index.html',
  imports: [ScreenReaderText, Loader],
})
export class ScreenLoader {
  // TODO - sr text
  protected readonly text = 'Loading A Page';
}
