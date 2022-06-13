import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class CourseService {
  constructor(private restangular: Restangular) { }

  create(params: any): Promise<any> {
    return this.restangular.all('courses').post(params).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('courses').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('courses', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('courses', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('courses', id).customDELETE().toPromise();
  }

  checkUsedCoupon(params: any): Promise<any> {
    return this.restangular.all('coupons/check-used-coupon').post(params).toPromise();
  }

  findSingleCoupon(id, params): Promise<any> {
    return this.restangular.one('coupons', id).get(params).toPromise();
  }

  changeStatus(id): Promise<any> {
    return this.restangular.one('course', id).one('change-status').customPUT().toPromise();
  }

  getLatest(id: string): Promise<any> {
    return this.restangular.one(`courses/${id}/latest`).get().toPromise();
  }
}
