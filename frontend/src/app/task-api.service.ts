import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { webSocket } from 'rxjs/webSocket';
import { environment } from '../environments/environment';
import { IAnswer } from './models/Answer';
import { ITask } from './models/Task';

@Injectable({
  providedIn: 'root',
})
export class TaskApi {
  private readonly apiUrl = environment.backendUrl;
  private socket$: WebSocketSubject<any>;

  constructor(private httpClient: HttpClient) {
    this.socket$ = webSocket(environment.socketUrl);
  }

  public getAnswers(): Observable<IAnswer[]> {
    return this.httpClient
      .get<{ data: IAnswer[] }>(`${this.apiUrl}/answers`)
      .pipe(map((response) => response.data || []));
  }

  public postAnswer(answer: ITask): Observable<IAnswer> {
    // TODO: fix AWS API Gateway
    // return this.httpClient.post<IAnswer>(`${this.apiUrl}/answers`, answer);
    return this.httpClient.post<IAnswer>(
      `https://wrtnlvbkz7.execute-api.eu-west-1.amazonaws.com/dev/answers`,
      answer,
    );
  }

  public getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }
}
