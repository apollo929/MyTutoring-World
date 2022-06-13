import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';

@Injectable()
export class FavoriteService {
  constructor(private restangular: Restangular) {}

  search(params: any, type: string): Promise<any> {
    return this.restangular.one(`favorites/${type}`).get(params).toPromise();
  }

  favorite(params: any, type: string): Promise<any> {
    return this.restangular.one(`favorites/${type}`).customPOST(params).toPromise();
  }

  unFavorite(id: any, type: string): Promise<any> {
    return this.restangular.one(`favorites/${type}`, id).customDELETE().toPromise();
  }
}
