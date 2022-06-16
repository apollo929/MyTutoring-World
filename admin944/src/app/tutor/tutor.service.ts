import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TutorService {
  constructor(private restangular: Restangular) {}

  create(credentials: any): Promise<any> {
    return this.restangular.all('tutors').post(credentials).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('tutors').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('tutors', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('tutors', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('tutors', id).customDELETE().toPromise();
  }

  me(): Promise<any> {
    return this.restangular.one('tutors', 'me').get().toPromise();
  }

  approve(id): Promise<any> {
    return this.restangular.one('tutors', id).one('approve').customPOST().toPromise();
  }

  reject(id, data): Promise<any> {
    return this.restangular.one('tutors', id).one('reject').customPOST(data).toPromise();
  }

  createCertificate(data: any): Promise<any> {
    return this.restangular.all('certificates').customPOST(data).toPromise();
  }

  updateCertificate(id, data: any): Promise<any> {
    return this.restangular.one('certificates', id).customPUT(data).toPromise();
  }

  deleteCertificate(id): Promise<any> {
    return this.restangular.one('certificates', id).customDELETE().toPromise();
  }

  changeStatus(id): Promise<any> {
    return this.restangular.one('tutors', id).one('change-status').customPUT().toPromise();
  }

  getTutorSubjects(params): Promise<any> {
    return this.restangular.one('my-subjects').get(params).toPromise();
  }

  inviteZoom(email: string): Promise<any> {
    return this.restangular.one('zoomus/create-user', email).post().toPromise();
  }
}
