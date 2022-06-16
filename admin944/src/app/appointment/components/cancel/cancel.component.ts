import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../../services/appointment.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
  selector: 'app-ngbd-modal-content',
  templateUrl: './modal.html'
})
export class CancelAppointmentComponent {
  @Input() info: any;
  public reason: String = '';

  constructor(
    private toasty: ToastrService,
    public activeModal: NgbActiveModal,
    private appointmentService: AppointmentService
  ) {}

  submit() {
    if (!this.reason) return this.toasty.error('Please enter reason!');

    this.appointmentService
      .cancel(this.info._id, { reason: this.reason })
      .then(resp => {
        this.activeModal.close(resp.data);
        this.toasty.success('Canceled successfuly!');
      })
      .catch(() => this.toasty.error('Something went wrong, please try again!'));
  }
}

@Component({
  selector: 'app-ngbd-modal-component',
  template: '<button class="btn btn-sm btn-outline-primary" (click)="open()">cancel</button>'
})
export class NgbdModalComponent {
  constructor(private modalService: NgbModal) {}
  @Input() appoinment: any = {};
  @Output() afterCancel = new EventEmitter();

  open() {
    const modalRef = this.modalService.open(CancelAppointmentComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.info = this.appoinment;
    modalRef.result.then(
      res => {
        this.afterCancel.emit(res);
      },
      () => {}
    );
  }
}
