import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/toPromise';
import { saveAs } from 'file-saver';
import { HttpHeaders } from '@angular/common/http';
@Injectable()
export class EarningStatsService {
  constructor(private restangular: Restangular) {}

  search(params: any): Promise<any> {
    return this.restangular.one('admin/payout/requests/stats').get(params).toPromise();
  }

  findOne(tutorId): Promise<any> {
    return this.restangular.one('admin/payout/requests/stats', tutorId).get().toPromise();
  }

  export(type: string, params: any) {
    //dsf
    let res = this.restangular
      .one('admin/earnings/export/', type)
      .withHttpConfig({
        responseType: 'blob'
      })
      .get(params)
      .subscribe(blob => {
        saveAs(blob, 'earnings');
        //console.log('g',r)
      });
  }
}
