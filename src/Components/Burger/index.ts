import { Component, input } from '@angular/core';

@Component({
  selector: 'burger',
  templateUrl: './index.html',
  styleUrl: './styles.scss',
})
export class Burger {
  readonly open = input.required<boolean>();
  readonly onClick = input.required<(e: MouseEvent) => void>();
}
