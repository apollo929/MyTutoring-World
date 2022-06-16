import { Component } from '@angular/core';
import { RequestPayoutService } from '../../services/request-payout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-request-payout',
  templateUrl: './view.html'
})
export class ViewComponent {
  public item: any = {};
  public info: any = {
    note: '',
    reason: ''
  };
  public appointment: any;
  public status: any;
  public config: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private payoutService: RequestPayoutService,
    private toasty: ToastrService
  ) {
    const id = this.route.snapshot.params.id;
    this.payoutService.findOne(id).then(res => {
      this.item = res.data;
      this.status = res.data.status;
      this.appointment = res.data.items[0];
    });
    this.config = this.route.snapshot.data['appConfig'];
  }

  reject(item) {
    if (this.status === 'rejected') {
      return this.toasty.error('This request has been rejected, can not be changed status');
    }
    if (this.status === 'approved') {
      return this.toasty.error('This request has been approved, can not be changed status');
    }
    if (!this.info.rejectReason) {
      return this.toasty.error('Please enter reason.');
    }
    this.payoutService
      .reject(item._id, { rejectReason: this.info.rejectReason, note: this.info.note })
      .then(res => {
        this.toasty.success('Success');
        this.router.navigate(['/requestPayout']);
      })
      .catch(() => this.toasty.error('Something went wrong, please try again!'));
  }

  approve(item) {
    if (this.status === 'approved') {
      return this.toasty.error('This request has been approved, can not be changed status');
    }
    if (this.status === 'rejected') {
      return this.toasty.error('This request has been rejected, can not be changed status');
    }
    this.payoutService
      .approve(item._id, { note: this.info.note })
      .then(res => {
        this.toasty.success('Success');
        this.router.navigate(['/payout/requests']);
      })
      .catch(() => this.toasty.error('Something went wrong, please try again!'));
  }
}
