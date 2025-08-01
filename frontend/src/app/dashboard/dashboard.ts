import { Component, OnInit, signal } from '@angular/core';
import { TaskApi } from '../task-api.service';
import { Answer } from '../answer/answer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [Answer],
})
export class Dashboard implements OnInit {
  public answers = signal(<IAnswer[]>[]);
  constructor(private quizApi: TaskApi) {}

  ngOnInit() {
    this.quizApi.getAnswers().subscribe((answers) => {
      this.answers.set(answers);
    });
  }
}
