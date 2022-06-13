import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class ReviewService {
  constructor(private restangular: Restangular) {}

  create(data: any): Promise<any> {
    return this.restangular.all('reviews').post(data).toPromise();
  }

  list(params: any): Promise<any> {
    return this.restangular.one('reviews').get(params).toPromise();
  }
  findOne(id): Promise<any> {
    return this.restangular.one('reviews', id).get().toPromise();
  }

  current(itemId: any, data: any): Promise<any> {
    return this.restangular.one('reviews').one(itemId, 'current').get(data).toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('reviews', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('reviews', id).customDELETE().toPromise();
  }

  findByRateToAndRateBy(query: any): Promise<any> {
    return this.restangular.one('reviews/findOne').get(query).toPromise();
  }
}
