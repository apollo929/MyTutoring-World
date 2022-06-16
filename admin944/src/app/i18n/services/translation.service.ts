import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TranslationService {
  constructor(private restangular: Restangular) {}

  create(data: any): Promise<any> {
    return this.restangular.all('i18n/translations').post(data).toPromise();
  }

  update(id, data: any): Promise<any> {
    return this.restangular.one('i18n/translations', id).customPUT(data).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('i18n/translations').get(params).toPromise();
  }

  remove(id): Promise<any> {
    return this.restangular.one('i18n/translations', id).customDELETE().toPromise();
  }

  pull(lang: String): Promise<any> {
    return this.restangular.one('i18n/translations', lang).one('pull').post().toPromise();
  }
}
