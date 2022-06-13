import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';


@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  public subjects: any = null;

  private _getSubjects: any;
  constructor(private restangular: Restangular) {}
  getSubjects(params: any): Promise<any> {
    if (this.subjects) {
      return Promise.resolve(this.subjects);
    }

    if (this._getSubjects && typeof this._getSubjects.then === 'function') {
      return this._getSubjects;
    }

    this._getSubjects = this.restangular
      .one('subjects')
      .get(params)
      .toPromise()
      .then(resp => {
        this.subjects = resp;
        return this.subjects;
      });
    return this._getSubjects;
  }

  search(params: any): Promise<any> {
    return this.restangular.one('subjects').get(params).toPromise();
  }
}
