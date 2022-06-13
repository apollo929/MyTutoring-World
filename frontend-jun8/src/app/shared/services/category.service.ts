import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class CategoryService {
  public categories: any = null;

  private _getCategories: any;
  constructor(private restangular: Restangular) {}

  getCategories(params: any): Promise<any> {
    if (this.categories) {
      return Promise.resolve(this.categories);
    }

    if (this._getCategories && typeof this._getCategories.then === 'function') {
      return this._getCategories;
    }

    this._getCategories = this.restangular
      .one('categories')
      .get(params)
      .toPromise()
      .then(resp => {
        this.categories = resp;
        return this.categories;
      });
    return this._getCategories;
  }

  create(params: any): Promise<any> {
    return this.restangular.all('categories').post(params).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('categories').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('categories', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('categories', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('categories', id).customDELETE().toPromise();
  }
}
