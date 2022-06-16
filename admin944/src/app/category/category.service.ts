import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CategoryService {
  constructor(private restangular: Restangular) { }

  create(params: any): Promise<any> {
    return this.restangular.all('categories').post(params).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('categories').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('categories', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('categories', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('categories', id).customDELETE().toPromise();
  }
}
