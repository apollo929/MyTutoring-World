import { forwardRef, Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services';
import { StripeServiceAccount } from '../services';

@Injectable()
export class PaymentGuard implements CanActivate {
  private active: boolean = true;
  private auth: AuthService;
  constructor(
    private router: Router,
    @Inject(forwardRef(() => AuthService)) auth: AuthService,
    private toasty: ToastrService,
    private stripeService: StripeServiceAccount
  ) {
    this.auth = auth;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.auth.isLoggedin()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    return this.auth.getCurrentUser().then(resp => {
      const canActive = resp;
      if (!canActive) {
        this.router.navigate(['/auth/login']);
        this.active = false;
        return this.active;
      }
      const url = state.url;
      if (canActive.type === 'tutor' && url !== '/users/payment-connect') {
        if (
          canActive.accountStripeId &&
          (!canActive.stripeChargesEnabled || !canActive.stripeDetailsSubmitted || !canActive.stripePayoutsEnabled)
        ) {
          return this.stripeService
            .checkStatusAccount(canActive.accountStripeId)
            .then(resp => {
              const { charges_enabled, details_submitted, payouts_enabled } = resp.data;
              this.auth.updateStatusPayment({
                stripeChargesEnabled: charges_enabled,
                stripeDetailsSubmitted: details_submitted,
                stripePayoutsEnabled: payouts_enabled
              });
              if (!charges_enabled || !details_submitted || !payouts_enabled) {
                this.toasty.error('Please complete the payment setup before proceeding with your action.');
                this.router.navigate(['/users/payment-connect']);
                this.active = false;
                return this.active;
              } else {
                this.active = true;
                return this.active;
              }
            })
            .catch(e => {
              this.active = false;
              this.toasty.error('Please complete the payment setup before proceeding with your action.');
              this.router.navigate(['/users/payment-connect']);
              return this.active;
            });
        } else if (!canActive.accountStripeId) {
          this.toasty.error('Please complete the payment setup before proceeding with your action.');
          this.router.navigate(['/users/payment-connect']);
          this.active = false;
          return this.active;
        }
      }
      return this.active;
    });
  }
}
