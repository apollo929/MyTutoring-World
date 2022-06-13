import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class LectureService {
    constructor(private restangular: Restangular) { }

    create(params: any): Promise<any> {
        return this.restangular.all('lectures').post(params).toPromise();
    }

    search(params: any): Promise<any> {
        return this.restangular.one('lectures').get(params).toPromise();
    }

    findOne(id): Promise<any> {
        return this.restangular.one('lectures', id).get().toPromise();
    }

    update(id, data): Promise<any> {
        return this.restangular.one('lectures', id).customPUT(data).toPromise();
    }

    delete(id): Promise<any> {
        return this.restangular.one('lectures', id).customDELETE().toPromise();
    }

    getCurrentSections(params: any): Promise<any> {
        return this.restangular.one('lecture').one('current').get(params).toPromise();
    }

}
