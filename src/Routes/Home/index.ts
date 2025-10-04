import { afterNextRender, Component } from '@angular/core';
import { ResetController, ThreeDButtonWithEntrance } from 'Components/3DButtonWithEntrance';
import { AlexText } from 'Components/AlexText';
import { TaskQueue } from 'Tools/TaskQueue';

@Component({
  selector: 'home-page',
  templateUrl: './index.html',
  styleUrl: './styles.scss',
  imports: [AlexText, ThreeDButtonWithEntrance],
})
export class Home {
  readonly reset = new ResetController();
  constructor() {
    afterNextRender({
      write: () => {
        TaskQueue.deferTask(() => {
          this.reset.activate();
        }, 100);
      },
    });
  }
  protected onClickWork() {}
}
