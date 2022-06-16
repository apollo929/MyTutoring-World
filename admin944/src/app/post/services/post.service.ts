import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PostService {
  constructor(private restangular: Restangular) { }

  create(credentials: any): Promise<any> {
    return this.restangular.all('posts').post(credentials).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('posts').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('posts', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('posts', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('posts', id).customDELETE().toPromise();
  }
}
