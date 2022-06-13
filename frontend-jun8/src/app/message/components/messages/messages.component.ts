import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { ConversationService } from '../../services/conversation.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../shared/services/auth.service';
// import { PusherService } from '../../services/pusher.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { SocketService } from '../../services/socket.service';
@Component({
  selector: 'messages',
  templateUrl: './messages.html'
})
export class MessagesComponent implements OnInit, OnDestroy {
  @Input() conversation: any;
  public items: any = [];
  public page: any = 1;
  public pageSize: any = 10;
  public total = 0;
  public currentUser: any = {};
  public newText: any = '';
  public receiver: any = null;
  private conversationSubscription: Subscription;
  public loading: boolean = false;
  @ViewChild('commentEl') comment: ElementRef;
  scrolltop: number = null;
  @ViewChildren('item') itemElements: QueryList<any>;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private service: MessageService,
    private conversationService: ConversationService,
    private toasty: ToastrService,
    private translate: TranslateService,
    private socket: SocketService
  ) {
    authService.getCurrentUser().then(resp => {
      this.currentUser = resp;
    });
    this.conversationSubscription = conversationService.conversationLoaded$.subscribe(data => {
      if (this.conversation && this.conversation._id === data._id) {
        return;
      }
      this.conversation = data;
      this.items = [];
      this.query();
    });
    this.socket.getMessage(msg => {
      if (this.conversation._id === msg.conversationId) {
        this.items = [...this.items, msg];
      }
    });
  }

  ngOnInit() {
    if (this.conversation) {
      this.query();
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.conversationSubscription.unsubscribe();
    this.socket.disconnect();
  }

  query() {
    this.loading = true;
    this.service
      .listByConversation(this.conversation._id, {
        page: this.page,
        take: this.pageSize
      })
      .then(resp => {
        this.total = resp.data.count;
        this.items = resp.data.items.reverse().concat(this.items);
        this.loading = false;
        const receivers = (this.conversation.members || []).filter(m => m._id !== this.currentUser._id);
        this.receiver = receivers && receivers.length ? receivers[0] : null;
        // this.scrolltop = this.comment.nativeElement.scrollHeight;
        this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
      });
  }

  private onItemElementsChanged(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.comment.nativeElement.scroll({
      top: this.comment.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  send() {
    if (!this.newText) {
      return this.toasty.error(this.translate.instant('Please enter message'));
    }

    this.service
      .send({
        text: this.newText,
        type: 'text',
        conversationId: this.conversation._id
      })
      .then(resp => {
        this.items.push(resp.data);
        this.service.afterSendSuccess(this.conversation._id, resp.data);
        this.newText = '';
        this.scrolltop = this.comment.nativeElement.scrollHeight;
      });
  }

  public enterToSend(event) {
    if (event.charCode === 13) {
      this.send();
    }
  }
}
