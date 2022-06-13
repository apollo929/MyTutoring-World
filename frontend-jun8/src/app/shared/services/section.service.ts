import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class SectionService {
  constructor(private restangular: Restangular) {}
  create(params: any): Promise<any> {
    return this.restangular.all('sections').post(params).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('sections').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('sections', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('sections', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('sections', id).customDELETE().toPromise();
  }
}
