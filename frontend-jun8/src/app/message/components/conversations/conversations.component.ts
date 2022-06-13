import { SeoService } from './../../../shared/services/seo.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConversationService } from '../../services/conversation.service';
import { SocketService } from '../../services/socket.service';
// import { PusherService } from '../../services/pusher.service';
import { orderBy } from 'lodash';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';

@Component({
  templateUrl: './conversations.html'
})
export class ConversationsComponent implements OnInit, OnDestroy {
  public originalConversations: any = [];
  public conversations: any = [];
  private currentUser: any;
  public activeConversation: any;
  public q: any = '';
  private sendMessageSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private service: ConversationService,
    private socket: SocketService,
    private seoService: SeoService,
    private messageService: MessageService
  ) {
    seoService.update('Messages');
    this.currentUser = route.snapshot.data.currentUser;
    this.conversations = this.mapConversationName(route.snapshot.data.conversations);
    this.originalConversations = this.conversations;
    this.socket.getMessage(msg => {
      if (this.activeConversation && this.activeConversation._id === msg.conversationId) {
        this.activeConversation.lastMessage = msg;
        this.activeConversation.updatedAt = msg.createdAt;
        this.conversations = orderBy(this.conversations, ['updatedAt'], ['desc']);
        return;
      } else {
        const conversation = this.conversations.find(item => item._id.toString() === msg.conversationId);
        if (conversation) {
          conversation.userMeta.unreadMessage += 1;
          conversation.lastMessage = msg;
          conversation.updatedAt = msg.createdAt;
          this.conversations = orderBy(this.conversations, ['updatedAt'], ['desc']);
        } else {
          this.service.findOne(msg.conversationId).then(resp => {
            if (resp.data) {
              resp.data.lastMessage = msg;
              const newConversation = this.mapConversationName([resp.data]);
              this.conversations = newConversation.concat(this.conversations);
              this.conversations = orderBy(this.conversations, ['updatedAt'], ['desc']);
            }
          });
        }
      }
    });
    this.sendMessageSubscription = this.messageService.sendMessage$.subscribe(data => {
      console.log(data);

      const { conversationId, message } = data;
      if (conversationId && message) {
        const conversation = this.conversations.find(item => item._id.toString() === conversationId.toString());
        if (conversation) {
          conversation.lastMessage = message;
          conversation.updatedAt = message.createdAt;
          this.conversations = orderBy(this.conversations, ['updatedAt'], ['desc']);
        }
      }
    });
  }

  ngOnInit() {
    this.socket.connect();
  }

  mapConversationName(conversations: any = []) {
    return conversations.map(conversation => {
      const member = (conversation.members || []).filter(m => m._id !== this.currentUser._id);
      conversation.name = member.length ? member[0].name : this.currentUser.name;
      conversation.member = member.length ? member[0] : this.currentUser;
      return conversation;
    });
  }

  selectConversation(conversation: any) {
    this.activeConversation = conversation;
    this.service.setActive(conversation);
    if (conversation && conversation.userMeta && conversation.userMeta.unreadMessage > 0) {
      this.service
        .read(conversation._id, { all: true })
        .then(resp => {
          if (resp && resp.data && resp.data.success) {
            conversation.userMeta.unreadMessage = 0;
          }
        })
        .catch(err => console.log(err));
    }
  }

  filter() {
    this.conversations = this.originalConversations.filter(
      conversation => conversation.name.toLowerCase().indexOf(this.q) > -1
    );
  }

  enterToSend(event) {
    if (event.charCode === 13) {
      this.filter();
    }
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }
}
