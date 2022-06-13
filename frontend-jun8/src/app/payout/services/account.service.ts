import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';

import * as _ from 'lodash';

@Injectable()
export class AccountService {
  constructor(private restangular: Restangular) {}

  find(params: any): Promise<any> {
    return this.restangular.one('payout/accounts').get(params).toPromise();
  }

  create(data: any): Promise<any> {
    return this.restangular.all('payout/accounts').post(data).toPromise();
  }

  remove(id): Promise<any> {
    return this.restangular.one('payout/accounts', id).customDELETE().toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('payout/accounts', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('payout/accounts', id).customPUT(data).toPromise();
  }
}
