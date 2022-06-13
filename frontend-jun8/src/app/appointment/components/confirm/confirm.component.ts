import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IUser, ISubject, IMylesson } from '../../../user/interface';
import { IBooking } from '../../interface';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-stripe',
  templateUrl: './confirm.html'
})
export class ConfirmModalComponent implements OnInit {
  @Input() subject: ISubject;
  @Input() tutor: IUser;
  @Input() slot: IMylesson;
  @Input() price: number = 0;
  @Input() config: any;
  @Input() appliedCoupon: boolean = false;
  @Input() timeSelList: any;
  constructor(public activeModal: NgbActiveModal, private toasty: ToastrService, private route: ActivatedRoute) {}

  ngOnInit() {}
  confirm() {
    this.activeModal.close({ confirmed: true });
  }
}
