import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessToken: String = null;
  private currentUser = null;
  private userLoaded = new Subject<any>();
  public userLoaded$ = this.userLoaded.asObservable();

  // ensure do not load if it is in the promise
  // because many component use get current user function
  private _getUser: any;

  constructor(private restangular: Restangular) {}

  getCurrentUser() {
    if (this.currentUser) {
      return new Promise(resolve => resolve(this.currentUser));
    }

    if (this._getUser && typeof this._getUser.then === 'function') {
      return this._getUser;
    }

    this._getUser = this.restangular
      .one('users', 'me')
      .get()
      .toPromise()
      .then(resp => {
        if (resp.data.role !== 'admin') {
          this.removeToken();
          throw new Error('Invalid role!');
        }

        this.currentUser = resp.data;
        this.userLoaded.next(resp.data);

        return resp.data;
      });
    return this._getUser;
  }

  login(credentials: any): Promise<any> {
    return this.restangular
      .all('auth/login')
      .post(credentials)
      .toPromise()
      .then(resp => {
        localStorage.setItem('accessToken', resp.data.token);
        return this.restangular
          .one('users', 'me')
          .get()
          .toPromise()
          .then(res => {
            if (res.data.role !== 'admin') {
              this.removeToken();
              throw new Error('Invalid role!');
            }
            this.currentUser = res.data;
            localStorage.setItem('isLoggedin', 'yes');
            return res.data;
          });
      });
  }

  register(info: any): Promise<any> {
    return this.restangular.all('auth/register').post(info).toPromise();
  }

  getAccessToken(): any {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('accessToken');
    }

    return this.accessToken;
  }

  forgot(email: String): Promise<any> {
    return this.restangular.all('auth/forgot').post({ email }).toPromise();
  }

  removeToken() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isLoggedin');
  }

  isLoggedin() {
    return localStorage.getItem('isLoggedin') === 'yes';
  }
}
