import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';

@Injectable()
export class RequestPayoutService {
  constructor(private restangular: Restangular) {}

  getBalance(params: any): Promise<any> {
    return this.restangular.one('payout/balance').get(params).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('payout/requests').get(params).toPromise();
  }

  create(data): Promise<any> {
    return this.restangular.all('payout/request').post(data).toPromise();
  }

  stats(params): Promise<any> {
    return this.restangular.one('payout/stats').get(params).toPromise();
  }

  findAccount(params: any): Promise<any> {
    return this.restangular.one('payout/accounts').get(params).toPromise();
  }
}
