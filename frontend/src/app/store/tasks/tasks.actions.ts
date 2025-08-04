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
