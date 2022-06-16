import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class WebinarService {
  constructor(private restangular: Restangular) {}

  create(params: any): Promise<any> {
    return this.restangular.all('webinars').post(params).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('webinars').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('webinars', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('webinars', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('webinars', id).customDELETE().toPromise();
  }

  changeStatus(id): Promise<any> {
    return this.restangular.one('webinar', id).one('change-status').customPUT().toPromise();
  }
}
