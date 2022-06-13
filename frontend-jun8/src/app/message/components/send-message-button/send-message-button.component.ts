import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../../shared/services';
import { ConversationService } from '../../services/conversation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'send-message-btn',
  template: `<button class="btn btn-blue" translate (click)="sendMessage()">
    <i class="far fa-envelope color-white mr-2"></i>
    <span translate>Send a Message</span>
  </button>`
})
export class SendMessageButtonComponent {
  @Input() recipientId: string;
  constructor(
    private toasty: ToastrService,
    private modalService: NgbModal,
    private authService: AuthService,
    private translate: TranslateService,
    private conversationService: ConversationService
  ) {}

  sendMessage() {
    if (!this.authService.isLoggedin()) {
      return this.toasty.error(this.translate.instant('Please login to send message'));
    }
    this.conversationService
      .create(this.recipientId)
      .then(resp => {
        const modalRef = this.modalService.open(MessageMessageModalComponent, {
          backdrop: 'static',
          keyboard: false
        });
        modalRef.componentInstance.conversation = resp.data;
        modalRef.result.then(
          result => {
            if (!result) {
              this.toasty.success(this.translate.instant('Your message has been sent'));
            }
          },
          () => {}
        );
      })
      .catch(() => this.toasty.error(this.translate.instant('You can not send messages to yourself')));
  }
}

@Component({
  templateUrl: './send-message-modal.html'
})
export class MessageMessageModalComponent implements OnInit {
  @Input() conversation: any;
  public message: any = {
    text: ''
  };
  public submitted: boolean = false;

  constructor(
    private service: MessageService,
    public activeModal: NgbActiveModal,
    private toasty: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  submit(frm: any) {
    this.submitted = true;
    if (frm.invalid) {
      return;
    }

    if (!this.message.text) {
      return this.toasty.error(this.translate.instant('Please enter message'));
    }

    this.service
      .send({
        conversationId: this.conversation._id,
        type: 'text',
        text: this.message.text
      })
      .then(() => this.activeModal.close());
  }
}
