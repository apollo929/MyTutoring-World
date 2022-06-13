import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  public appConfig: any = null;

  private _getConfig: any;
  constructor(private restangular: Restangular) {}

  configs(): Promise<any> {
    if (this.appConfig) {
      if (localStorage.getItem('userLang')) {
        this.appConfig = Object.assign(this.appConfig, { userLang: localStorage.getItem('userLang') });
      }
      return Promise.resolve(this.appConfig);
    }

    if (this._getConfig && typeof this._getConfig.then === 'function') {
      return this._getConfig;
    }

    this._getConfig = this.restangular
      .one('system/configs/public')
      .get()
      .toPromise()
      .then(resp => {
        this.appConfig = resp.data;

        // load user lang here
        const userLang = localStorage.getItem('userLang') || resp.data.i18n.defaultLanguage || 'en';
        this.appConfig.userLang = userLang;

        return this.appConfig;
      });
    return this._getConfig;
  }

  setUserLang(lang: string) {
    localStorage.setItem('userLang', lang);
  }
}
