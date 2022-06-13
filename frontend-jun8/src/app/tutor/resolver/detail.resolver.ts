import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { TutorService } from '../services/tutor.service';

@Injectable()
export class TutorDetailResolver implements Resolve<Observable<any>> {
  constructor(private service: TutorService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.service
      .findOne(route.params.username)
      .then(resp => resp.data)
      .catch(err => {
        if (err.data.code == '404') this.router.navigate(['pages/404-not-found']);
        else {
          this.router.navigate(['pages/error', err.data.code]);
        }
      });
  }
}
