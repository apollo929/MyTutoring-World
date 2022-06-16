import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TestimonialService {
  constructor(private restangular: Restangular) {}

  create(credentials: any): Promise<any> {
    return this.restangular.all('testimonials').post(credentials).toPromise();
  }

  search(params: any): Promise<any> {
    return this.restangular.one('testimonials').get(params).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('testimonials', id).get().toPromise();
  }

  update(id, data): Promise<any> {
    return this.restangular.one('testimonials', id).customPUT(data).toPromise();
  }

  delete(id): Promise<any> {
    return this.restangular.one('testimonials', id).customDELETE().toPromise();
  }
}
