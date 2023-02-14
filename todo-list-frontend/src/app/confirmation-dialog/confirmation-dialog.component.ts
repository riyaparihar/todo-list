import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
  <div class="modal">
    <p class="modal-content">
      Are you sure you want to delete 
      <span class="todo">{{task}}</span>?
    </p>
    <div class="modal-footer">
      <button class="confirm-button" (click)="handleModalClose(1)">Confirm</button>
      <button (click)="handleModalClose(0)">Cancel</button>
    </div>
</div>
  `,
  styleUrls: [
    'confirmation-dialog.component.scss'
  ]
})
export class ConfirmationDialogComponent implements OnInit {
  @Input() task!: string;
  @Output() closeModal = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  handleModalClose(response: number) {
    this.closeModal.emit(response);
  }

}
