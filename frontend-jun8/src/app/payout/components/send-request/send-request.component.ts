import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RequestPayoutService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SeoService } from '../../../shared/services';
import { AuthService } from '../../../shared/services';
import { IPayoutAccount, IPayoutRequest } from '../interface';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'create-request-payout',
  templateUrl: './form.html'
})
export class CreateRequestPayoutComponent implements OnInit {
  public balance: IPayoutRequest;
  public payoutAccountId: any = '';
  public accounts: IPayoutAccount[] = [];
  public tutorId: any;
  public config: any;
  @Output() onRequest = new EventEmitter();

  constructor(
    private router: Router,
    private payoutService: RequestPayoutService,
    private toasty: ToastrService,
    private seoService: SeoService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {
    seoService.update('Send request');
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.authService.getCurrentUser().then(resp => {
      this.tutorId = resp.id;
      const params = {
        tutorId: this.tutorId
      };
      this.getBalance(params);
    });

    this.payoutService
      .findAccount({
        take: 50,
        sortBy: 'createdAt',
        sortType: 'desc'
      })
      .then(res => {
        this.accounts = res.data.items;
        this.payoutAccountId = this.accounts[0]._id;
      })
      .catch(() => this.toasty.error(this.translate.instant('Something went wrong, please try again!')));
  }

  getBalance(params: any) {
    this.payoutService
      .getBalance(params)
      .then(resp => {
        this.balance = resp.data;
      })
      .catch(() => this.toasty.error(this.translate.instant('Something went wrong, please try again!')));
  }
  submit() {
    if (!this.payoutAccountId) {
      return this.toasty.error(this.translate.instant('Please enter Payout Account Id'));
    }
    this.payoutService
      .create({ payoutAccountId: this.payoutAccountId })
      .then(res => {
        this.onRequest.emit(res.data);
        this.toasty.success(this.translate.instant('Your request has been sent.'));
        this.router.navigate(['/users/payout/request']);
      })
      .catch(err => {
        this.toasty.error(
          this.translate.instant(err.data.message || err.data.data.message || 'Something went wrong, please try again')
        );
      });
  }
}
