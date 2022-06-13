import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
// import { TutorService } from '../../../tutor/services/tutor.service';
// import { UserService } from '../../../user/services/user.service';

@Component({
  selector: 'app-upload-avatar',
  templateUrl: './avatar-upload.modal.html'
})
export class AvatarUploadComponent implements OnInit {
  @Input() info: any;
  public maxFileSize: number;
  public avatarOptions: any = {};
  public avatarUrl: any = '';
  public imageSelected: any[] = [];
  constructor(
    // private toasty: ToastrService,
    public activeModal: NgbActiveModal,
    // private tutorService: TutorService,
    // private userService: UserService
  ) {
    this.maxFileSize = window.appConfig.maximumFileSize;
  }

  ngOnInit() {
    this.avatarOptions = {
      url: window.appConfig.apiBaseUrl + '/users/avatar',
      fileFieldName: 'avatar',
      onFinish: resp => {
        this.avatarUrl = resp.data.url;
        this.activeModal.close(this.avatarUrl);
      },
      onFileSelect: resp => (this.imageSelected = resp),
      accept: 'image/*'
    };
  }
}

@Component({
  selector: 'app-ngbd-modal-component',
  template: '<button class="btn btn-sm btn-outline-primary" (click)="open()">cancel</button>'
})
export class NgbdModalComponent {
  constructor(private modalService: NgbModal) {}
  @Input() appoinment: any = {};
  @Output() afterCancel = new EventEmitter();

  open() {
    const modalRef = this.modalService.open(AvatarUploadComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.info = this.appoinment;
    modalRef.result.then(
      res => {
        this.afterCancel.emit(res);
      },
      () => {}
    );
  }
}
