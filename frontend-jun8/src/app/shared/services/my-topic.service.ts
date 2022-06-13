import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class MyTopicService {
  constructor(private restangular: Restangular) {}
  create(params: any): Promise<any> {
    return this.restangular.all('my-topic').post(params).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('my-topics').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('my-topic', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('my-topic', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('my-topic', id).customDELETE().toPromise();
  }

  getListOfMe(params: any): Promise<any> {
    return this.restangular.one('my-topics/me').get(params).toPromise();
  }
}
