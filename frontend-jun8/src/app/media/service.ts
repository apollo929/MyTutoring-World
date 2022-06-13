import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  constructor(private restangular: Restangular) {}

  search(params: any): Promise<any> {
    return this.restangular.one('media', 'search').get(params).toPromise();
  }

  upload(base64: string, options: any): Promise<any> {
    return this.restangular
      .all('media/photos')
      .post(
        Object.assign(options, {
          base64
        })
      )
      .toPromise();
  }

  update(id: string, params: any): Promise<any> {
    return this.restangular.one('media', id).customPUT(params).toPromise();
  }
}
