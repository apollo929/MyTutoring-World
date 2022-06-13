import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';


@Injectable()
export class RequestRefundService {
  constructor(private restangular: Restangular) { }

  search(params: any): Promise<any> {
    return this.restangular.one('refund/requests').get(params).toPromise();
  }

  create(data): Promise<any> {
    return this.restangular.all('refund/request').post(data).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('refund/requests', id).get().toPromise();
  }
}
