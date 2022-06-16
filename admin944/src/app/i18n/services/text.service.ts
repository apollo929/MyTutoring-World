import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TextService {

  constructor(private restangular: Restangular) { }

  create(data: any): Promise<any> {
    return this.restangular.all('i18n/text').post(data).toPromise();
  }

  update(id, data: any): Promise<any> {
    return this.restangular.one('i18n/text', id).customPUT(data).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('i18n/text').get(params).toPromise();
  }

  remove(id): Promise<any> {
    return this.restangular.one('i18n/text', id).customDELETE().toPromise();
  }
}
