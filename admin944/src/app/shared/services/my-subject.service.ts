import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class MySubjectService {
  constructor(private restangular: Restangular) {}
  create(params: any): Promise<any> {
    return this.restangular.all('my-subject').post(params).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('my-subjects').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('my-subject', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('my-subject', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('my-subject', id).customDELETE().toPromise();
  }

  getListOfMe(params: any): Promise<any> {
    return this.restangular.one('my-subjects/me').get(params).toPromise();
  }
}
