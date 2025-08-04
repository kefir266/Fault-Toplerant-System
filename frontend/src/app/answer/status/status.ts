import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status',
  imports: [],
  templateUrl: './status.html',
  styleUrl: './status.scss',
})
export class Status {
  @Input() status!: IStatus;
}
