import { Component, computed, inject } from '@angular/core';
import { Loader } from 'Components/Loader';
import { ScreenReaderText } from 'Components/ScreenReaderText';
import { NavigationState } from 'State/Navigation';
import { Router } from 'Tools/Router';

@Component({
  selector: 'screen-loader',
  templateUrl: './index.html',
  imports: [ScreenReaderText, Loader],
})
export class ScreenLoader {
  readonly router = inject(Router);
  readonly navigation = inject(NavigationState);
  readonly text = computed(() =>
    this.navigation.loading() ? `Loading ${this.router.activeRoute()?.title ?? ''}` : '',
  );
}
