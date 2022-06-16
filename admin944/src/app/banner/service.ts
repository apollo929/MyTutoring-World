import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';

@Injectable()
export class BannerService {
  private allowFields = [
    'title', 'content', 'mediaId', 'link'
  ];
  constructor(private restangular: Restangular) { }

  create(data: any): Promise<any> {
    return this.restangular.all('banners').post(_.pick(data, this.allowFields)).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('banners').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('banners', id).get().toPromise();
  }

  update(id,data): Promise<any> {
    return this.restangular.one('banners', id).customPUT(_.pick(data, this.allowFields)).toPromise();
  }

  remove(id): Promise<any> {
    return this.restangular.one('banners', id).customDELETE().toPromise();
  }
}
