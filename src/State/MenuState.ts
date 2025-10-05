import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuState {
  menuOpen = signal(false);
  buttonDelay = signal(10000);
  linksVisible = signal(false);
  public close() {
    this.menuOpen.set(false);
  }

  public toggle = () => {
    this.menuOpen.update((s) => !s);
  };

  public setButtonDelay(delay: number) {
    this.buttonDelay.set(delay);
  }
}
