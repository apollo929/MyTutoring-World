import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';

@Injectable()
export class NewsletterService {
  constructor(private restangular: Restangular) {}

  contacts(params: any): Promise<any> {
    return this.restangular.one('newsletter', 'contact').get(params).toPromise();
  }

  remove(id: String): Promise<any> {
    return this.restangular.one('newsletter', 'contact').customDELETE(id).toPromise();
  }

  sendMail(content: any): Promise<any> {
    return this.restangular.one('newsletter').customPOST(content, 'sendmail').toPromise();
  }
}
