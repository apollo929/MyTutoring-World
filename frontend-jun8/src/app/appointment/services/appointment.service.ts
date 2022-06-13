import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';

@Injectable()
export class AppointmentService {
  constructor(private restangular: Restangular) {}

  create(credentials: any): Promise<any> {
    return this.restangular.all('appointments/book').post(credentials).toPromise();
  }
  search(params: any): Promise<any> {
    return this.restangular.one('appointments').get(params).toPromise();
  }
  cancel(id: string, data: any): Promise<any> {
    return this.restangular.one('appointments', id).one('cancel').customPOST(data).toPromise();
  }
  checkFree(tutorId: any): Promise<any> {
    return this.restangular.one('appointments/check').one('free').customPOST(tutorId).toPromise();
  }
  findOne(id): Promise<any> {
    return this.restangular.one('appointments', id).get().toPromise();
  }
  appointmentTutor(tutorId: any, params: any): Promise<any> {
    return this.restangular.one('appointments/tutors', tutorId).get(params).toPromise();
  }

  checkOverlap(data: any): Promise<any> {
    return this.restangular.one('appointments/check').one('overlap').customPOST(data).toPromise();
  }
}
