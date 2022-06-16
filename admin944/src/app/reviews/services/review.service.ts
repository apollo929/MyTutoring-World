import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ReviewService {
  constructor(private restangular: Restangular) {}
  findOne(id): Promise<any> {
    return this.restangular.one('reviews', id).get().toPromise();
  }

  current(type: any, itemId: any): Promise<any> {
    return this.restangular.one('reviews', type).one(itemId, 'current').get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('reviews', id).customPUT(data).toPromise();
  }
  list(params: any): Promise<any> {
    return this.restangular.one('reviews').get(params).toPromise();
  }

  remove(id): Promise<any> {
    return this.restangular.one('reviews', id).customDELETE().toPromise();
  }
}
