import {Component} from '@angular/core';
import {Todo, TodoService} from "./todo.service";
import {Observable, of, Subject} from "rxjs";
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
      <app-progress-bar *ngIf="!hasTodosLoaded"></app-progress-bar>
      <ng-container *ngIf="todos$|async as todos">
        <app-todo-item class="todo-item" (click)="handleTodoItemClick(todo)" *ngFor="let todo of todos" [item]="todo"></app-todo-item>
        <div class="no-match" *ngIf="!todos?.length && hasTodosLoaded">
          {{searchInput.value?'No match found!': 'No task created yet!'}}
        </div>
      </ng-container>
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
    this.getAllTodos();
  }

  get showResponseMessage():boolean {
    return !!this.response && !!Object.keys(this.response)?.length;
  }

  getAllTodos(query?:string): void {
    this.todos$ = this.todoService.getAll(query).pipe(
      map((todos: Todo[]) => {
        this.hasTodosLoaded = true;
        return todos
      })
    )
  }

  handleSearch(query: string): void {
    this.hasTodosLoaded = false;
    this.getAllTodos(query);
  }

  handleTodoItemClick(todo: Todo): void {
    this.selectedTodo = todo;
    this.showConfirmationModal = true;
  }

  handleModalClose(response: number): void {
    if (!!response) {
      this.removeTask();
    }
    this.showConfirmationModal = false;
  }

  removeTask() {
    this.hasTodosLoaded = false;
    this.todoService.remove(this.selectedTodo.id).subscribe({
      next: () => {
        this.handleRemoveResponse('success', "Todo removed successfully");
        this.getAllTodos();
      },
      error: (error) =>this.handleRemoveResponse('error', error )
    })
  }

  private handleRemoveResponse(type: responseType, message:string) {
    this.response = { type, message };
    setTimeout(() => this.response = null, MESSAGE_DISPLAY_TIME);
    this.hasTodosLoaded = true;
  }
}
