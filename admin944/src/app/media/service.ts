import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  constructor(private restangular: Restangular) {}

  search(params: any): Promise<any> {
    return this.restangular.one('media', 'search').get(params).toPromise();
  }

  upload(base64: String, options: any): Promise<any> {
    return this.restangular
      .all('media/photos')
      .post(
        Object.assign(options, {
          base64
        })
      )
      .toPromise();
  }

  update(id: String, params: any): Promise<any> {
    return this.restangular.one('media', id).customPUT(params).toPromise();
  }
}
