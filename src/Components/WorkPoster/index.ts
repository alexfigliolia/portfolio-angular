import { Component, computed, effect, inject, input } from '@angular/core';
import { MenuState } from 'State/MenuState';
import { NavigationState } from 'State/Navigation';
import { WorkState } from 'State/WorkState';
import { Content } from './Content';
import { Title } from './Title';
import { IPosterData } from './types';

@Component({
  selector: 'work-poster',
  templateUrl: './index.html',
  styleUrl: './index.scss',
  imports: [Title, Content],
  host: {
    '[class.active]': 'active()',
    '[style.--background-small]': 'smallImageURL()',
    '[style.--background-large]': 'largeImageURL()',
  },
})
export class WorkPoster {
  readonly menu = inject(MenuState);
  readonly state = inject(WorkState);
  readonly index = input.required<number>();
  readonly data = input.required<IPosterData>();
  readonly navigation = inject(NavigationState);
  readonly posterActive = computed(() => this.state.activeIndex() === this.index());
  readonly active = computed(() => this.navigation.screenActive() && this.posterActive());
  readonly titleLetters = computed(() => this.data().name.split(''));
  readonly titleLength = computed(() => this.titleLetters().filter((v) => !!v).length);
  readonly activeDelay = computed(() => this.titleLength() * 50 + 500);
  readonly smallImageURL = computed(() => `url(${this.data().imgSmall})`);
  readonly largeImageURL = computed(() => `url(${this.data().imgLarge})`);
  constructor() {
    effect(() => {
      if (this.posterActive()) {
        this.menu.setButtonDelay(this.activeDelay() + 2200);
      }
    });
  }
}
