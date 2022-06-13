import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';

@Injectable()
export class CalendarService {
  constructor(private restangular: Restangular) {}

  search(params: any): Promise<any> {
    return this.restangular.one('schedule').get(params).toPromise();
  }

  create(data: any): Promise<any> {
    return this.restangular.all('schedule').post(data).toPromise();
  }

  update(id: string, data: any): Promise<any> {
    return this.restangular.all('schedule').customPUT(data, id).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('schedule', id).customDELETE().toPromise();
  }

  deleteByHash(hash): Promise<any> {
    return this.restangular.one('schedule/remove-by-hash', hash).customDELETE().toPromise();
  }

  checkByHash(hash): Promise<any> {
    return this.restangular.one(`schedule/check-by-hash/${hash}`).post().toPromise();
  }

  checkByWebinar(webinarId): Promise<any> {
    return this.restangular.one(`schedule/check-by-webinar/${webinarId}`).post().toPromise();
  }
}
