import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

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

  enroll(params: any): Promise<any> {
    return this.restangular.all('enroll').post(params).toPromise();
  }

  gift(params: any): Promise<any> {
    return this.restangular.all('gift').post(params).toPromise();
  }

  checkUsedCoupon(id: string): Promise<any> {
    return this.restangular.one('coupons/check-used-coupon', id).get().toPromise();
  }

  applyCoupon(params): Promise<any> {
    return this.restangular.one('coupon/apply-coupon').get(params).toPromise();
  }

  checkBooked(webinarId: String, targetType: String): Promise<any> {
    return this.restangular.one(`enroll/${webinarId}/${targetType}/booked`).post().toPromise();
  }

  getEnrolledList(id: string): Promise<any> {
    return this.restangular.one(`webinars/${id}/enrolled`).get().toPromise();
  }

  checkOverlapWebinar(data: any): Promise<any> {
    return this.restangular.one('webinars/check').one('overlap').customPOST(data).toPromise();
  }

  getLatest(id: string): Promise<any> {
    return this.restangular.one(`webinars/${id}/latest`).get().toPromise();
  }
}
