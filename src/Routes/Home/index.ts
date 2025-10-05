import { Component, effect, input } from '@angular/core';
import { ResetController, ThreeDButtonWithEntrance } from 'Components/3DButtonWithEntrance';
import { AlexText } from 'Components/AlexText';
import { BaseRoute } from 'Tools/BaseRoute';

@Component({
  selector: 'home-page',
  templateUrl: './index.html',
  styleUrl: './styles.scss',
  imports: [AlexText, ThreeDButtonWithEntrance],
  host: {
    '[class.active]': 'navigation.screenActive()',
  },
})
export class Home extends BaseRoute {
  readonly reset = new ResetController();
  readonly title = input.required<string>();
  readonly timeout = input.required<number>();
  constructor() {
    super();
    this.activateButton();
  }

  protected onClickWork = () => {
    window.location.hash = '#work';
  };

  private activateButton() {
    effect(() => {
      if (this.navigation.screenActive()) {
        this.reset.activate();
      }
    });
  }
}
