import { IAnswer } from './Answer';

export type ITask = Pick<IAnswer, 'taskId' | 'answer'> & { question: string };
