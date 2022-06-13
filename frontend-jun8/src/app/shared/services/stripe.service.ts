import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class StripeServiceAccount {
  constructor(private restangular: Restangular) {}
  createLinkToStripe(params: any): Promise<any> {
    return this.restangular.one('payment').one('stripe/create-link').customPOST(params).toPromise();
  }

  createStripeAccount(params: any): Promise<any> {
    return this.restangular.one('payment').one('stripe/create-account').customPOST(params).toPromise();
  }

  acceptance(accountId: string): Promise<any> {
    return this.restangular.one('payment').one('stripe/acceptance').one(accountId).customPOST().toPromise();
  }

  checkStatusAccount(accountId: string): Promise<any> {
    return this.restangular.one('payment').one('stripe/status').one(accountId).get().toPromise();
  }

  getBankAccount(accountId: string): Promise<any> {
    return this.restangular.one('payment').one('stripe/bank-account').one(accountId).get().toPromise();
  }
}
