import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';

@Injectable()
export class TutorService {
  constructor(private restangular: Restangular) {}

  search(params: any): Promise<any> {
    return this.restangular.one('tutors').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('tutors', id).get().toPromise();
  }
  update(data): Promise<any> {
    return this.restangular.one('tutors').customPUT(data).toPromise();
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
}
