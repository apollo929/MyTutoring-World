import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TestimonialService {
  constructor(private restangular: Restangular) {}

  search(params: any): Promise<any> {
    return this.restangular.one('testimonials').get(params).toPromise();
  }
}
