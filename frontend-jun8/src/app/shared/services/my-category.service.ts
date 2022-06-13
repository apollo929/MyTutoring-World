import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class MyCategoryService {
  constructor(private restangular: Restangular) {}
  create(params: any): Promise<any> {
    return this.restangular.all('my-category').post(params).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('my-categories').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('my-category', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('my-category', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('my-category', id).customDELETE().toPromise();
  }

  getListOfMe(params: any): Promise<any> {
    return this.restangular.one('my-categories/me').get(params).toPromise();
  }
}
