import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AppointmentService {
  constructor(private restangular: Restangular) {}

  create(credentials: any): Promise<any> {
    return this.restangular.all('appointments').post(credentials).toPromise();
  }

  cancel(id: String, data: any): Promise<any> {
    return this.restangular.one('appointments', id).one('cancel').customPOST(data).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('appointments').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('appointments', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('appointments', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('appointments', id).customDELETE().toPromise();
  }
}
