import { Component, effect } from '@angular/core';
import { ResetController, ThreeDButtonWithEntrance } from 'Components/3DButtonWithEntrance';
import { ContactText } from 'Components/ContactText';
import { BaseRoute } from 'Tools/BaseRoute';

@Component({
  selector: 'contact-page',
  templateUrl: './index.html',
  styleUrl: './styles.scss',
  host: {
    '[class.active]': 'navigation.screenActive()',
  },
  imports: [ContactText, ThreeDButtonWithEntrance],
})
export class Contact extends BaseRoute {
  readonly reset = new ResetController();
  constructor() {
    super();
    this.activateButtons();
  }

  toGithub = () => {
    this.openLink('https://github.com/alexfigliolia');
  };

  toNPM = () => {
    this.openLink('https://www.npmjs.com/~alexfigliolia');
  };

  emailMe = () => {
    this.openLink("mailto:alexfigliolia@gmail.com?subject=Hey%20Alex,%20let's%20chat!");
  };

  private openLink(link: string) {
    window.open(link, '_blank');
  }

  private activateButtons() {
    effect(() => {
      if (this.navigation.screenActive()) {
        this.reset.activate();
      }
    });
  }
}
