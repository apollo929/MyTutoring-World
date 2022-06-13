import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class CourseService {
  constructor(private restangular: Restangular, private http: HttpClient) { }

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

  checkBooked(courseId: String, targetType: String): Promise<any> {
    return this.restangular.one(`enroll/${courseId}/${targetType}/booked`).post().toPromise();
  }

  getEnrolledList(id: string): Promise<any> {
    return this.restangular.one(`courses/${id}/enrolled`).get().toPromise();
  }

  checkOverlapCourse(data: any): Promise<any> {
    return this.restangular.one('courses/check').one('overlap').customPOST(data).toPromise();
  }

  getLatest(id: string): Promise<any> {
    return this.restangular.one(`courses/${id}/latest`).get().toPromise();
  }

  getMyCourses(params: any): Promise<any> {
    return this.restangular.one('my-course').get(params).toPromise();
  }

  convertToBase64(url: string) {
    this.http.get(url, { responseType: "blob" }).subscribe(blob => {
      const reader = new FileReader();
      const binaryString = reader.readAsDataURL(blob);
      reader.onload = (event: any) => {
        //Here you can do whatever you want with the base64 String
        console.log("File in Base64: ", event.target.result);
        return event.target.result
      };

      return blob;

      reader.onerror = (event: any) => {
        console.log("File could not be read: " + event.target.error.code);
      };
    });
  }

}
