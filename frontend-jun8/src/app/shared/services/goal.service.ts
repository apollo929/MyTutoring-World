import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class GoalService {
    constructor(private restangular: Restangular) { }

    create(params: any): Promise<any> {
        return this.restangular.all('goals').post(params).toPromise();
    }

    search(params: any): Promise<any> {
        return this.restangular.one('goals').get(params).toPromise();
    }

    findOne(id): Promise<any> {
        return this.restangular.one('goals', id).get().toPromise();
    }

    update(id, data): Promise<any> {
        return this.restangular.one('goals', id).customPUT(data).toPromise();
    }

    delete(id): Promise<any> {
        return this.restangular.one('goals', id).customDELETE().toPromise();
    }

    getCurrentCoupon(params: any): Promise<any> {
        return this.restangular.one('goal').one('current').get(params).toPromise();
    }

}
