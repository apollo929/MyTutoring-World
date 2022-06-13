import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';
// import { List } from 'immutable';
// import Pusher from 'pusher-js';
import { AuthService } from '../../shared/services';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PusherService {
  private pusher: any;
  // private channels: any[];
  private _messages = new Subject<any>();
  public messages = this._messages.asObservable();

  constructor(private authService: AuthService) {
    authService.getCurrentUser().then(user => {
      // this.pusher = new Pusher(window.appConfig.pusher.key, {
      //   cluster: window.appConfig.pusher.cluster,
      //   encrypted: true,
      //   authEndpoint: `${window.appConfig.apiBaseUrl}/pusher/auth`,
      //   auth: {
      //     headers: {
      //       authorization: `Bearer ${authService.getAccessToken()}`
      //     }
      //   }
      // });
      // this.pusher.logToConsole = true;
      // this.channels = [];
      // const channel = this.pusher.subscribe(`private-${user._id}`);
      // channel.bind('new_message', data => this._messages.next(data));
    });
  }
}
