import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class ProgressService {
    constructor(private restangular: Restangular) { }

    create(params: any): Promise<any> {
        return this.restangular.all('progresses').post(params).toPromise();
    }

    search(params: any): Promise<any> {
        return this.restangular.one('progresses').get(params).toPromise();
    }

    findOne(id): Promise<any> {
        return this.restangular.one('progresses', id).get().toPromise();
    }

    update(id, data): Promise<any> {
        return this.restangular.one('progresses', id).customPUT(data).toPromise();
    }

    delete(id): Promise<any> {
        return this.restangular.one('progresses', id).customDELETE().toPromise();
    }

    getCurrentCoupon(params: any): Promise<any> {
        return this.restangular.one('progress').one('current').get(params).toPromise();
    }

}
