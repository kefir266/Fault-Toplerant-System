interface IAnswer {
  id: string;
  taskId: number;
  answer: string;
  answerStatus: string;
  attempt: number;
  errorMessage: string;
  createdAt: Date;
}
