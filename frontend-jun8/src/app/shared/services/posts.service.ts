import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  public posts: any = null;

  private _getPosts: any;
  constructor(private restangular: Restangular) {}
  getPosts(params: any): Promise<any> {
    if (this.posts) {
      return Promise.resolve(this.posts);
    }

    if (this._getPosts && typeof this._getPosts.then === 'function') {
      return this._getPosts;
    }

    this._getPosts = this.restangular
      .one('posts')
      .get(params)
      .toPromise()
      .then(resp => {
        this.posts = resp;
        return this.posts;
      });
    return this._getPosts;
  }
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
