import { ITask } from '../../models/Task';

export class AddTask {
  static readonly type = '[Tasks] Add item';
  constructor(readonly payload: ITask) {}
}

export class GetTasks {
  static readonly type = '[Tasks] Get tasks';
  constructor() {}
}

export class NextTask {
  static readonly type = '[Tasks] Next task';
  constructor() {}
}

export class UpdateTask {
  static readonly type = '[Tasks] Update task';
  constructor(readonly payload: ITask) {}
}
