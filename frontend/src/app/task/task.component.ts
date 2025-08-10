import { Component, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { FormsModule } from '@angular/forms';
import { AddTask, NextTask } from '../store/tasks/tasks.actions';
import { ITask } from '../models/Task';
import { TasksState } from '../store/tasks/tasks.state';

@Component({
  selector: 'app-task',
  imports: [FormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class Task {
  task: Signal<ITask>;

  constructor(private store: Store) {
    this.task = this.store.selectSignal(TasksState.getCurrentTask);
  }

  submitAnswer() {
    if (this.task().answer.length > 0) {
      this.store.dispatch(new AddTask(this.task()));
      this.store.dispatch(new NextTask());
    }
  }
}
