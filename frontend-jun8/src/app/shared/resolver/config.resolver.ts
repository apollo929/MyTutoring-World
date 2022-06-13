import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';



import { SystemService } from '../services';

@Injectable()
export class ConfigResolver implements Resolve<Observable<any>> {
  constructor(private systemService: SystemService) {}

  resolve(): any {
    return this.systemService.configs();
  }
}
