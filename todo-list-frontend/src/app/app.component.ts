import {Component} from '@angular/core';
import {Todo, TodoService} from "./todo.service";
import {Observable} from "rxjs";
import { debounceTime, map } from 'rxjs/operators';

type responseType = "error" | "success";
const MESSAGE_DISPLAY_TIME = 1000;
@Component({
  selector: 'app-root',
  template: `
    <div class="title">
      <h1>
        A list of TODOs
      </h1>
    </div>
    <div class="response" [ngClass]="response?.type||''" *ngIf="showResponseMessage">{{response?.message}}</div>
    <div class="list">
      <label for="search">Search...</label>
      <input id="search" type="text" #searchInput (keyup)="handleSearch(searchInput.value)">
      <app-progress-bar  *ngIf="(!(todos$|async)?.length && !hasTodosLoaded)"></app-progress-bar>
      <app-todo-item class="todo-item" (click)="handleTodoItemClick(todo)" *ngFor="let todo of todos$ | async" [item]="todo"></app-todo-item>
      <div class="no-match" *ngIf="!(todos$|async)?.length && hasTodosLoaded">
         {{searchInput.value?'No match found!': 'No task created yet!'}}
      </div>
    </div>
    <app-confirmation-dialog *ngIf="!!selectedTodo" [task]="selectedTodo.task" [ngClass]="showConfirmationModal? 'show':'hide'" class="confirmation-modal" (closeModal)="handleModalClose($event)"></app-confirmation-dialog>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  todos$!: Observable<Todo[]>;
  hasTodosLoaded: boolean = false;
  showConfirmationModal: boolean = false;
  selectedTodo!: Todo;
  response!: { type: responseType, message: string; }| null;

  constructor(private todoService: TodoService) {
    this.todos$ = todoService.getAll();
  }

  get showResponseMessage():boolean {
    return !!this.response && !!Object.keys(this.response)?.length;
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

  handleTodoItemClick(todo: Todo): void {
    this.selectedTodo = todo;
    this.showConfirmationModal = true;
  }

  handleModalClose(response: number): void {
    if (!!response) {
      this.removeTask();
      this.todos$ = this.todoService.getAll().pipe(map(todos=> {
        this.hasTodosLoaded = true;
        return todos;
      }))
    }
    this.showConfirmationModal = false;
  }

  removeTask() {
    this.hasTodosLoaded = false;
    this.todoService.remove(this.selectedTodo.id).subscribe({
      next: () => this.handleRemoveResponse('success', "Todo removed successfully" ),
      error: (error) =>this.handleRemoveResponse('error', error )
    })
  }

  private handleRemoveResponse(type: responseType, message:string) {
    this.response = { type, message };
    setTimeout(() => this.response = null, MESSAGE_DISPLAY_TIME);
  }
}
