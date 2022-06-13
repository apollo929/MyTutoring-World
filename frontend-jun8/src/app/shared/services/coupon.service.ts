import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class CouponService {
  constructor(private restangular: Restangular) { }

  create(params: any): Promise<any> {
    return this.restangular.all('coupons').post(params).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('coupons').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('coupons', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('coupons', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('coupons', id).customDELETE().toPromise();
  }

  getCurrentCoupon(params: any): Promise<any> {
    return this.restangular.one('coupon').one('current').get(params).toPromise();
  }

  checkUsedCoupon(id: string): Promise<any> {
    return this.restangular.one('coupons/check-used-coupon', id).get().toPromise();
  }

  applyCoupon(params): Promise<any> {
    return this.restangular.one('coupon/apply-coupon').get(params).toPromise();
  }

  checkBooked(webinarId: String): Promise<any> {
    return this.restangular.one(`enroll/${webinarId}/booked`).post().toPromise();
  }
}
