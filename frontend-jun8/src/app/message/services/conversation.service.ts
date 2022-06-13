import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ConversationService {
  private conversationLoaded = new Subject<any>();
  public conversationLoaded$ = this.conversationLoaded.asObservable();

  constructor(private restangular: Restangular) {}

  list(params: any): Promise<any> {
    return this.restangular.one('messages/conversations').get(params).toPromise();
  }

  create(recipientId: string): Promise<any> {
    return this.restangular.one('messages/conversations').customPOST({ recipientId }).toPromise();
  }

  setActive(conversation: any) {
    this.conversationLoaded.next(conversation);
  }

  read(conversationId: string, params: any): Promise<any> {
    return this.restangular.one('messages/conversations', conversationId).one('read').customPOST(params).toPromise();
  }

  findOne(id: string): Promise<any> {
    return this.restangular.one('messages/conversation', id).get().toPromise();
  }
}
