import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SubjectService {
  constructor(private restangular: Restangular) { }

  create(credentials: any): Promise<any> {
    return this.restangular.all('subjects').post(credentials).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('subjects').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('subjects', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('subjects', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('subjects', id).customDELETE().toPromise();
  }
}
