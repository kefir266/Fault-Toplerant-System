import { Component, Input } from '@angular/core';
import { IAnswer } from '../models/Answer';
import { Status } from './status/status';

@Component({
  selector: 'tr[app-answer]',
  imports: [Status],
  templateUrl: './answer.html',
  styleUrl: './answer.scss',
})
export class Answer {
  @Input({ required: true }) answer!: IAnswer;
}
