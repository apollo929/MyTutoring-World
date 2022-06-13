import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class LectureSectionService {
    constructor(private restangular: Restangular) { }

    create(params: any): Promise<any> {
        return this.restangular.all('lecture-sections').post(params).toPromise();
    }

    search(params: any): Promise<any> {
        return this.restangular.one('lecture-sections').get(params).toPromise();
    }

    findOne(id): Promise<any> {
        return this.restangular.one('lecture-sections', id).get().toPromise();
    }

    update(id, data): Promise<any> {
        return this.restangular.one('lecture-sections', id).customPUT(data).toPromise();
    }

    delete(id): Promise<any> {
        return this.restangular.one('lecture-sections', id).customDELETE().toPromise();
    }

    getCurrentSections(params: any): Promise<any> {
        return this.restangular.one('lecture-section').one('current').get(params).toPromise();
    }

}
