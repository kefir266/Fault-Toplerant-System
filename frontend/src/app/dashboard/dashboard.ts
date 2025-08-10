import { Component, OnInit, Signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { GetTasks } from '../store/tasks/tasks.actions';
import { TasksState } from '../store/tasks/tasks.state';
import { Status } from '../status/status';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [MatTableModule, Status],
})
export class Dashboard implements OnInit {
  displayedColumns: string[] = [
    'taskId',
    'answer',
    'answerStatus',
    'attempt',
    'errorMessage',
  ];
  public answers: Signal<any>;
  public isLoading: Signal<boolean>;
  constructor(private store: Store) {
    this.answers = this.store.selectSignal(TasksState.getState);
    this.isLoading = this.store.selectSignal(TasksState.isLoading);
  }

  ngOnInit() {
    this.getAnswers();
  }

  getAnswers() {
    this.store.dispatch(new GetTasks());
  }
}
