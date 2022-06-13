import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessToken: string = null;
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
        this.currentUser = resp.data;
        this.userLoaded.next(resp.data);
        return this.currentUser;
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
        localStorage.setItem('isLoggedin', 'yes');
        return this.restangular
          .one('users', 'me')
          .get()
          .toPromise()
          .then(res => {
            this.currentUser = res.data;
            localStorage.setItem('isLoggedin', 'yes');
            localStorage.setItem('timeZone', res.data.timezone);
            this.userLoaded.next(res.data);
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

  forgot(email: string): Promise<any> {
    return this.restangular.all('auth/forgot').post({ email }).toPromise();
  }

  removeToken() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isLoggedin');
  }

  isLoggedin() {
    return localStorage.getItem('isLoggedin') === 'yes';
  }

  registerTutor(info: any): Promise<any> {
    return this.restangular.all('tutors/register').post(info).toPromise();
  }

  updateStatusPayment(data: any) {
    this.currentUser.stripeChargesEnabled = data.stripeChargesEnabled;
    this.currentUser.stripeDetailsSubmitted = data.stripeDetailsSubmitted;
    this.currentUser.stripePayoutsEnabled = data.stripePayoutsEnabled;
  }
}
