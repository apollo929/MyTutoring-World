import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';


import { TutorService } from '../services/tutor.service';

@Injectable()
export class TutorSearchResolver implements Resolve<Observable<any>> {
  constructor(private tutorService: TutorService) {
  }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const searchFields = {
      subjectId: route.queryParams.subjectId || '',
      take: 9
    };
    return this.tutorService.search(searchFields).then(resp => resp.data);
  }
}
