import { Component, Input } from '@angular/core';

@Component({
  selector: 'appointment-status',
  template: `<span class="badge badge-primary" *ngIf="status === 'booked'">Booked</span>
    <span class="badge badge-warning" *ngIf="status === 'pending'">Pending</span>
    <span class="badge badge-danger" *ngIf="status === 'canceled'">Canceled</span>
    <span class="badge badge-primary" *ngIf="status === 'progressing'">In Progress</span>
    <span class="badge badge-success" *ngIf="status === 'completed'">Completed</span>
    <span class="badge badge-dark" *ngIf="status === 'not-start'">Not start</span>&nbsp; `
})
export class AppointmentStatusComponent {
  @Input() status: any = '';

  constructor() {}
}
