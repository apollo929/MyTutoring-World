import { SeoService } from '../../../shared/services/seo.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, CountryService } from '../../../shared/services';
import { filter } from 'rxjs/operators';
import { StripeServiceAccount } from '../../services/stripe.service';
import { IUser } from '../../interface';
import { StripeService, StripeCardComponent } from 'ngx-stripe';

@Component({
  templateUrl: './stripe.html'
})
export class StripeComponent implements OnInit {
  public accountId: string;
  public currentUser: IUser;
  public account: any = {
    email: '',
    country: '',
    type: 'standard',
    business_type: 'individual'
  };
  public hasAccount: boolean = false;
  public isSubmitted: boolean = false;
  public countries: any = [];
  public sending: boolean = false;
  public statusAccount: any = {
    charges_enabled: false,
    details_submitted: false,
    payouts_enabled: false
  };
  constructor(
    private router: Router,
    private toasty: ToastrService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private seoService: SeoService,
    private stripeServiceAccount: StripeServiceAccount,
    private stripeService: StripeService,
    private countryService: CountryService
  ) {
    seoService.update('Stripe');
  }

  ngOnInit() {
    this.authService.getCurrentUser().then(resp => {
      if (resp._id) {
        this.currentUser = resp;
        if (this.currentUser.accountStripeId) {
          this.accountId = this.currentUser.accountStripeId;
          this.checkStatusAccount();
        }
      }
    });
    this.countries = this.countryService.getCountry();
  }

  createLink() {
    this.sending = true;
    this.stripeServiceAccount
      .createLinkToStripe({
        accountId: this.accountId,
        refresh_url: window.appConfig.url + '/users/payment-connect',
        return_url: window.appConfig.url + '/users/payment-connect'
      })
      .then(resp => {
        this.sending = false;
        if (resp && resp.data && resp.data.url) {
          location.href = resp.data.url;
        }
      })
      .catch(err => {
        this.sending = false;
        return this.toasty.error((err.data && err.data.data && err.data.data.message) || err.data.message);
      });
  }

  createAccount() {
    this.sending = true;
    this.stripeServiceAccount
      .createStripeAccount(this.account)
      .then(resp => {
        if (resp && resp.data && resp.data.id) {
          this.currentUser.accountStripeId = resp.data.id;
          this.accountId = resp.data.id;
          this.stripeServiceAccount
            .checkStatusAccount(this.currentUser.accountStripeId)
            .then(resp => {
              this.statusAccount = resp.data;
              this.sending = false;
            })
            .catch(err => {
              this.sending = false;
              return this.toasty.error((err.data && err.data.data && err.data.data.message) || err.data.message);
            });
        }
        this.sending = false;
      })
      .catch(err => {
        this.sending = false;
        return this.toasty.error((err.data && err.data.data && err.data.data.message) || err.data.message);
      });
  }

  accept() {
    this.sending = true;
    this.stripeServiceAccount
      .checkStatusAccount(this.currentUser.accountStripeId)
      .then(resp => {
        this.currentUser.tosAcceptance = true;
        this.sending = false;
      })
      .catch(err => {
        this.sending = false;
        return this.toasty.error((err.data && err.data.data && err.data.data.message) || err.data.message);
      });
  }

  checkStatusAccount() {
    this.sending = true;
    this.stripeServiceAccount
      .checkStatusAccount(this.currentUser.accountStripeId)
      .then(resp => {
        console.log(resp.data);

        this.statusAccount = resp.data;
        this.sending = false;
      })
      .catch(err => {
        this.sending = false;
        return this.toasty.error((err.data && err.data.data && err.data.data.message) || err.data.message);
      });
  }

  getBankAccount() {
    this.sending = true;
    this.stripeServiceAccount
      .checkStatusAccount(this.currentUser.accountStripeId)
      .then(resp => {
        this.statusAccount = resp.data;
        this.sending = false;
      })
      .catch(err => {
        this.sending = false;
        return this.toasty.error((err.data && err.data.data && err.data.data.message) || err.data.message);
      });
  }
}
