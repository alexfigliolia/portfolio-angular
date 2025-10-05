import { Component, computed, inject } from '@angular/core';
import { MenuState } from 'State/MenuState';
import { Link } from './Link';

@Component({
  selector: 'nav-menu',
  templateUrl: './index.html',
  styleUrl: './styles.scss',
  imports: [Link],
})
export class Menu {
  readonly menu = inject(MenuState);
  readonly closed = computed(() => !this.menu.menuOpen());
}
