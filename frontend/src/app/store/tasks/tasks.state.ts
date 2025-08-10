import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { AddTask, GetTasks, NextTask, UpdateTask } from './tasks.actions';
import { TaskApi } from '../../task-api.service';
import { tasks } from '../../mocks/tasks';
import { IAnswer } from '../../models/Answer';
import { ITask } from '../../models/Task';

export interface TasksStateModel {
  items: IAnswer[];
  tasks: ITask[];
  currentTaskId: number;
  isLoading: boolean;
}

@State<TasksStateModel>({
  name: 'tasks',
  defaults: {
    items: [],
    tasks: tasks,
    currentTaskId: 1,
    isLoading: false,
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

  @Selector()
  static isLoading(state: TasksStateModel) {
    return state.isLoading;
  }

  constructor(
    private taskApi: TaskApi,
    private store: Store,
  ) {
    this.taskApi.getMessages().subscribe((message) => {
      if (message.eventName === 'MODIFY') {
        this.store.dispatch(new UpdateTask(message.dynamodb.NewImage));
      } else {
        this.store.dispatch(new GetTasks());
      }
    });
  }

  @Action(AddTask)
  add(ctx: StateContext<TasksStateModel>, { payload }: AddTask) {
    this.taskApi.postAnswer(payload).subscribe();
  }

  @Action(GetTasks)
  getTasks(ctx: StateContext<TasksStateModel>) {
    const stateModel = ctx.getState();
    ctx.setState({
      ...stateModel,
      isLoading: true,
    });
    return this.taskApi.getAnswers().subscribe((tasks) => {
      ctx.setState({
        ...stateModel,
        items: tasks,
        isLoading: false,
      });
    });
  }

  @Action(NextTask)
  nextTask(ctx: StateContext<TasksStateModel>) {
    const stateModel = ctx.getState();
    if (stateModel.currentTaskId < tasks.length) {
      ctx.setState({
        ...stateModel,
        currentTaskId: stateModel.currentTaskId + 1,
      });
    }
  }

  @Action(UpdateTask)
  updateTask(
    ctx: StateContext<TasksStateModel>,
    { payload }: { payload: any },
  ) {
    const stateModel = ctx.getState();
    const answer = this.imageToModel(payload);
    const idx = stateModel.items.findIndex((a) => a.id === answer.id);
    if (idx !== -1) {
      const items = [...stateModel.items];
      items[idx] = answer;
      ctx.setState({
        ...stateModel,
        items,
      });
    }
  }

  private imageToModel(image: any): IAnswer {
    return Object.keys(image).reduce((acc, key) => {
      const type = Object.keys(image[key])[0];
      if (type === 'NULL') return acc;

      const value = image[key][type];
      return {
        ...acc,
        [key]: value,
      };
    }, {}) as IAnswer;
  }
}
