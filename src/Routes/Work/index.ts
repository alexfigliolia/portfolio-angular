import { afterNextRender, Component, inject, OnDestroy } from '@angular/core';
import { PageSwitch } from '@figliolia/page-switch';
import { ResetController } from 'Components/3DButtonWithEntrance';
import { WorkPoster } from 'Components/WorkPoster';
import { WorkState } from 'State/WorkState';
import { BaseRoute } from 'Tools/BaseRoute';
import API from './API';

@Component({
  selector: 'work-page',
  templateUrl: './index.html',
  styleUrl: './styles.scss',
  providers: [WorkState],
  imports: [WorkPoster],
  host: {
    '[class.active]': 'navigation.screenActive()',
  },
})
export class Work extends BaseRoute implements OnDestroy {
  readonly API = API;
  private PW?: PageSwitch;
  readonly state = inject(WorkState);
  readonly reset = new ResetController();
  constructor() {
    super();
    this.createSlider();
  }

  private createSlider() {
    afterNextRender({
      write: async () => {
        const { PageSwitch } = await import('@figliolia/page-switch');
        this.PW = new PageSwitch('workSlider', {
          duration: 750,
          transition: 'scrollCover',
        });
        this.PW.on('after', (index) => {
          this.state.activate(index);
        });
      },
    });
  }

  public ngOnDestroy() {
    this.PW?.destroy?.();
  }
}
