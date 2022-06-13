import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class PaymentService {
  constructor(private restangular: Restangular) {}
  enroll(params: any): Promise<any> {
    return this.restangular.all('enroll').post(params).toPromise();
  }
}
