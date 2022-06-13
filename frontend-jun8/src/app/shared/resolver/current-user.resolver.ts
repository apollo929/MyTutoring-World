import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

import { AuthService } from '../services/auth.service';

@Injectable()
export class CurrentUserResolver implements Resolve<Observable<any>> {
  constructor(private service: AuthService) { }

  resolve(): Observable<any> | Promise<any> | any {
    return this.service.getCurrentUser();
  }
}
