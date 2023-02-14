import {Component} from '@angular/core';
import {Todo, TodoService} from "./todo.service";
import {Observable} from "rxjs";
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <div class="title">
      <h1>
        A list of TODOs
      </h1>
    </div>
    <div class="list">
      <label for="search">Search...</label>
      <input id="search" type="text" #searchInput (keyup)="handleSearch(searchInput.value)">
      <app-progress-bar  *ngIf="!(todos$|async)?.length && !hasTodosLoaded"></app-progress-bar>
      <app-todo-item *ngFor="let todo of todos$ | async" [item]="todo"></app-todo-item>
      <div class="no-match" *ngIf="!(todos$|async)?.length && hasTodosLoaded">
         No match found!
      </div>
    </div>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  todos$: Observable<Todo[]>;
  hasTodosLoaded: boolean = false;

  constructor(private todoService: TodoService) {
    this.todos$ = todoService.getAll();
  }

  handleSearch(query: string): void {
    this.hasTodosLoaded = false;
    this.todos$ = this.todoService.getAll().pipe(
      debounceTime(200),
      map((todos: Todo[]) => {
        this.hasTodosLoaded = true;
        return todos.filter((todo: Todo) => todo.task.toLowerCase().includes(query.toLowerCase())
        );
      })
    )
  }
}
