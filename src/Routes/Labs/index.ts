import { Component } from '@angular/core';
import { Experiment } from 'Components/Experiment';
import { LabsText } from 'Components/LabsText';
import { BaseRoute } from 'Tools/BaseRoute';
import { API } from './API';

@Component({
  selector: 'labs-page',
  templateUrl: './index.html',
  styleUrl: './styles.scss',
  host: {
    '[class.active]': 'navigation.screenActive()',
  },
  imports: [LabsText, Experiment],
})
export class Labs extends BaseRoute {
  readonly API = API;
  constructor() {
    super(2000);
  }
}
