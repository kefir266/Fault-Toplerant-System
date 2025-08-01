import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-answer',
  imports: [],
  templateUrl: './answer.html',
  styleUrl: './answer.scss',
})
export class Answer {
  @Input({ required: true }) answer!: IAnswer;
}
