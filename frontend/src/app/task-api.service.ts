import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { IAnswer } from './models/Answer';
import { ITask } from './models/Task';

@Injectable({
  providedIn: 'root',
})
export class TaskApi {
  private readonly apiUrl = environment.backendUrl;

  constructor(private httpClient: HttpClient) {}

  public getAnswers(): Observable<IAnswer[]> {
    return this.httpClient
      .get<{ data: IAnswer[] }>(`${this.apiUrl}/answers`)
      .pipe(map((response) => response.data || []));
  }

  public postAnswer(answer: ITask): Observable<IAnswer> {
    console.log('Posting answer:', answer);
    return this.httpClient.post<IAnswer>(`${this.apiUrl}/answers`, answer);
  }
}
