import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class AppointmentService {
  constructor(private restangular: Restangular) {}

  search(params: any): Promise<any> {
    return this.restangular.one('appointments').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('appointments', id).get().toPromise();
  }

  updateDocument(id, data: any): Promise<any> {
    return this.restangular.one('appointments', id).one('update-document').customPUT(data).toPromise();
  }

  tutorCancel(appointmentId: string, data: any) {
    return this.restangular.one('appointments/tutor', appointmentId).one('cancel').customPOST(data).toPromise();
  }

  studentCancel(appointmentId: string, data: any) {
    return this.restangular.one('appointments/student', appointmentId).one('cancel').customPOST(data).toPromise();
  }

  canReschedule(appointmentId: string) {
    return this.restangular.one('appointments', appointmentId).one('canReschedule').post().toPromise();
  }

  reSchedule(appointmentId: string, data: any) {
    return this.restangular.one('appointments', appointmentId).one('reSchedule').customPUT(data).toPromise();
  }

  reviewStudent(appointmentId: string, data: any): Promise<any> {
    return this.restangular.one('appointments', appointmentId).one('reviewStudent').customPOST(data).toPromise();
  }

  checkOverlap(data: any): Promise<any> {
    return this.restangular.one('appointments/check').one('overlap').customPOST(data).toPromise();
  }

  startMeeting(appointmentId: string): Promise<any> {
    return this.restangular.one('meeting/start', appointmentId).customPOST().toPromise();
  }

  joinMeeting(appointmentId: string): Promise<any> {
    return this.restangular.one('meeting/join', appointmentId).customPOST().toPromise();
  }
}
