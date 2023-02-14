import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {delay, map} from "rxjs/operators";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';

export interface Todo {
  id: number;
  task: string;
  priority: 1 | 2 | 3;
}

let mockData: Todo[] = [
  { id: 0, task: 'Implement loading - frontend only', priority: 1 },
  { id: 1, task: 'Implement search - frontend only', priority: 2 },
  { id: 2, task: 'Implement delete on click - frontend only', priority: 1 },
  { id: 3, task: 'Replace mock service by integrating backend', priority: 3 },
];

function removeFromMockData(id: number) {
  mockData = mockData.filter(todo => todo.id !== id);
}
const httpOptions = {
  headers: new HttpHeaders(),
  params: new HttpParams(),
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {

readonly todoListURL="api/todo/list";
readonly todoURL="api/todo/"

  getAll(query?: string): Observable<Todo[]> {
    const route = query ? this.todoListURL + `?search=${query}` : this.todoListURL;
    return this.httpClient.get<any>(route);
  }

  remove(id: number): Observable<void> {
    return this.httpClient.delete<any>(`${this.todoURL}${id}`);
  }

  constructor(private httpClient: HttpClient){}
}
