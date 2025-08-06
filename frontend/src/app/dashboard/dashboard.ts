import { Component, OnInit, Signal, signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { IAnswer } from '../models/Answer';
import { Answer } from '../answer/answer';
import { GetTasks } from '../store/tasks/tasks.actions';
import { TasksState } from '../store/tasks/tasks.state';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [Answer],
})
export class Dashboard implements OnInit {
  public answers: Signal<any>;
  public isLoading: Signal<boolean>;
  constructor(private store: Store) {
    this.answers = this.store.selectSignal(TasksState.getState);
    this.isLoading = this.store.selectSignal(TasksState.isLoading);
    console.log(this.isLoading());
  }

  ngOnInit() {
    this.getAnswers();
  }

  getAnswers() {
    this.store.dispatch(new GetTasks());
  }
}
