import { Injectable } from '@angular/core';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class UserService {
  constructor(private restangular: Restangular) {}

  me(): Promise<any> {
    return this.restangular.one('users', 'me').get().toPromise();
  }

  updateMe(data): Promise<any> {
    return this.restangular.all('users').customPUT(data).toPromise();
  }

  findOne(id): Promise<any> {
    return this.restangular.one('users', id).get().toPromise();
  }

  update(data): Promise<any> {
    return this.restangular.one('users').customPUT(data).toPromise();
  }

  inviteFriend(params: any) {
    return this.restangular.all('newsletter/invite-friend').post(params).toPromise();
  }

  deleteAvatar() {
    return this.restangular.one('users/avatar/delete').customDELETE().toPromise();
  }

  changeEmail(id, data): Promise<any> {
    return this.restangular.one('users', id).one('change-email').customPUT(data).toPromise();
  }
}
