import { Component } from '@angular/core';
import { RequestRefundService } from '../../services/request-refund.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-request-refund',
  templateUrl: './detail.html'
})
export class DetailRefundRequestComponent {
  public item: any = {};
  public approve: any = {
    note: ''
  };
  public reject: any = {
    note: '',
    rejectReason: ''
  };
  private id: any;
  public status: string = '';
  public config: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private refundService: RequestRefundService,
    private toasty: ToastrService
  ) {
    this.id = this.route.snapshot.params.id;
    this.refundService.findOne(this.id).then(res => {
      this.item = res.data;
      this.status = this.item.status;
    });
    this.config = this.route.snapshot.data['appConfig'];
  }

  approveRequest() {
    if (window.confirm('Are you sure want to approve this request?')) {
      this.refundService
        .approve(this.id, this.approve)
        .then(resp => {
          if (resp.data.success) {
            this.status = 'approved';
            this.toasty.success('Approved successfully');
          }
        })
        .catch(e => this.toasty.error(e.data.message));
    }
  }

  rejectRequest() {
    if (this.reject.rejectReason === '') {
      return this.toasty.error('Please enter reason');
    }
    if (window.confirm('Are you sure want to reject this request?')) {
      this.refundService
        .reject(this.id, this.reject)
        .then(resp => {
          if (resp.data.success) {
            this.status = 'rejected';
            this.toasty.success('Rejected successfully');
          }
        })
        .catch(e => this.toasty.error(e.data.message));
    }
  }

  confirm() {
    if (window.confirm('Are you sure want to confirm this request?')) {
      this.refundService
        .confirm(this.id)
        .then(resp => {
          if (resp.data.success) {
            this.status = 'refunded';
            this.toasty.success('Confirm successfully');
          }
        })
        .catch(e => this.toasty.error(e.data.message));
    }
  }
}
