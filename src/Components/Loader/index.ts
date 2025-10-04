import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'loader',
  templateUrl: './index.html',
  styleUrl: './index.scss',
})
export class Loader {
  @HostBinding('attr.role') protected readonly role = 'alert';
  @HostBinding('attr.aria-live') protected readonly live = 'assertive';
}
