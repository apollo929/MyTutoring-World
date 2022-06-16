import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
  constructor(private restangular: Restangular) {}

  create(credentials: any): Promise<any> {
    return this.restangular.all('users').post(credentials).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('users', 'search').get(params).toPromise();
  }

  me(): Promise<any> {
    return this.restangular.one('users', 'me').get().toPromise();
  }

  updateMe(data): Promise<any> {
    return this.restangular.all('users').customPUT(data).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('users', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('users', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('users', id).customDELETE().toPromise();
  }

  findGroups(params: any): Promise<any> {
    return this.restangular.one('users/groups/search').get(params).toPromise();
  }

  createGroup(data: any): Promise<any> {
    return this.restangular.all('users/groups').post(data).toPromise();
  }

  findGroup(id: String): Promise<any> {
    return this.restangular.one('users/groups', id).get().toPromise();
  }

  updateGroup(id: String, data: any): Promise<any> {
    return this.restangular.one('users/groups', id).customPUT(data).toPromise();
  }

  removeGroup(id: String): Promise<any> {
    return this.restangular.one('users/groups', id).customDELETE().toPromise();
  }
}
