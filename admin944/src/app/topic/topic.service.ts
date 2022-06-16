import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TopicService {
  constructor(private restangular: Restangular) {}

  create(params: any): Promise<any> {
    return this.restangular.all('topics').post(params).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('topics').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('topics', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('topics', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('topics', id).customDELETE().toPromise();
  }
}
