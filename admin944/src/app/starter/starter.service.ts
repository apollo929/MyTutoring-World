import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class starterService {
    constructor(private restangular: Restangular) { }
    stats(): Promise<any> {
        return this.restangular.one('admin', 'stats').get().toPromise();
      }
}

