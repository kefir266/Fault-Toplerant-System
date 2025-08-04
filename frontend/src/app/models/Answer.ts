export interface IAnswer {
  id: string;
  taskId: number;
  answer: string;
  answerStatus: IStatus;
  attempt: number;
  errorMessage: string;
  createdAt: Date;
}
