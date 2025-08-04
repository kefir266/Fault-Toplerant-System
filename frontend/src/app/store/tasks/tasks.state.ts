import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AddTask, GetTasks, NextTask } from './tasks.actions';
import { TaskApi } from '../../task-api.service';
import { tasks } from '../../mocks/tasks';
import { IAnswer } from '../../models/Answer';
import { ITask } from '../../models/Task';

export interface TasksStateModel {
  items: IAnswer[];
  tasks: ITask[];
  currentTaskId: number;
}

@State<TasksStateModel>({
  name: 'tasks',
  defaults: {
    items: [],
    tasks: tasks,
    currentTaskId: 1,
  },
})
@Injectable()
export class TasksState {
  @Selector()
  static getState(state: TasksStateModel) {
    return state;
  }

  @Selector()
  static getCurrentTask(state: TasksStateModel) {
    return (
      state.tasks.find((task: ITask) => task.taskId === state.currentTaskId) ||
      state.tasks[1]
    );
  }

  constructor(private taskApi: TaskApi) {}

  @Action(AddTask)
  add(ctx: StateContext<TasksStateModel>, { payload }: AddTask) {
    this.taskApi.postAnswer(payload).subscribe();
  }

  @Action(GetTasks)
  getTasks(ctx: StateContext<TasksStateModel>) {
    return this.taskApi.getAnswers().subscribe((tasks) => {
      const stateModel = ctx.getState();
      stateModel.items = tasks;
      ctx.setState(stateModel);
    });
  }

  @Action(NextTask)
  nextTask(ctx: StateContext<TasksStateModel>) {
    // just get next mocked task
    const stateModel = ctx.getState();
    // to simplify, indexes equal taskId
    if (stateModel.currentTaskId < tasks.length) {
      ctx.setState({
        ...stateModel,
        currentTaskId: stateModel.currentTaskId + 1,
      });
    }
  }
}
