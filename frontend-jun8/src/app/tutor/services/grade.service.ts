import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';


@Injectable()
export class GradeService {
  constructor(private restangular: Restangular) { }

  create(credentials: any): Promise<any> {
    return this.restangular.all('grades').post(credentials).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('grades').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('grades', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('grades', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('grades', id).customDELETE().toPromise();
  }
}
