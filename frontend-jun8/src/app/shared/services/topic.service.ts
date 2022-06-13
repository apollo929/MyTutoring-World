import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class TopicService {
  public topics: any = null;

  private _getTopics: any;
  constructor(private restangular: Restangular) {}

  getTopics(params: any): Promise<any> {
    if (this.topics) {
      return Promise.resolve(this.topics);
    }

    if (this._getTopics && typeof this._getTopics.then === 'function') {
      return this._getTopics;
    }

    this._getTopics = this.restangular
      .one('topics')
      .get(params)
      .toPromise()
      .then(resp => {
        this.topics = resp;
        return this.topics;
      });
    return this._getTopics;
  }
  search(params: any): Promise<any> {
    return this.restangular.one('topics').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('topics', id).get().toPromise();
  }
}
