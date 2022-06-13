import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { SubjectService } from '../services';

@Injectable()
export class SubjectsResolver implements Resolve<Observable<any>> {
  constructor(private service: SubjectService) {}

  resolve(): any {
    return this.service.getSubjects({ take: 1000, isActive: true }).then(resp => resp.data.items);
  }
}
