import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class MessageService {
  private sendMessage = new Subject<any>();
  public sendMessage$ = this.sendMessage.asObservable();
  constructor(private restangular: Restangular) {}

  listByConversation(conversationId: string, params: any): Promise<any> {
    return this.restangular.one('messages/conversations', conversationId).get(params).toPromise();
  }

  send(data: any) {
    return this.restangular.one('messages').customPOST(data).toPromise();
  }

  afterSendSuccess(conversationId: string, message: string) {
    this.sendMessage.next({
      conversationId,
      message
    });
  }
}
