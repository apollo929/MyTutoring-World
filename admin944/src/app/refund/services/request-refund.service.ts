import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

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

  reject(id, data): Promise<any> {
    return this.restangular.one('refund/request', id).one('reject').customPOST(data).toPromise();
  }

  approve(id, data): Promise<any> {
    return this.restangular.one('refund/request', id).one('approve').customPOST(data).toPromise();
  }
  confirm(id): Promise<any> {
    return this.restangular.one('refund/request', id).one('confirm').customPOST().toPromise();
  }
}
