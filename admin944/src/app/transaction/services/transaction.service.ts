import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TransactionService {
  constructor(private restangular: Restangular) {}
  search(params: any): Promise<any> {
    return this.restangular.one('payment/transactions').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('payment/transactions', id).get().toPromise();
  }
}
