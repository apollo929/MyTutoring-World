import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/services';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
  templateUrl: 'modal-signup.component.html'
})
export class ModalSignupComponent {
  public account: any = {
    email: '',
    password: '',
    name: '',
    type: ''
  };
  public accountTutor: any = {
    email: '',
    password: '',
    name: '',
    issueDocument: '',
    resumeDocument: '',
    certificationDocument: ''
  };
  public confirm: any = {
    pw: ''
  };
  public isMath: boolean = false;
  public submitted: boolean = false;
  public idDocumentOptions: any = {};
  public resumeOptions: any = {};
  public certificationOptions: any = {};
  public idDocumentFile: any;
  public resumeFile: any;
  public certificationFile: any;
  public appConfig: any;

  constructor(
    private auth: AuthService,
    public router: Router,
    private toasty: ToastrService,
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute
  ) {
    this.idDocumentOptions = {
      url: window.appConfig.apiBaseUrl + '/tutors/upload-document',
      onCompleteItem: resp => {
        // if (resp.code && resp.code !== 200) {
        //   this.idDocumentOptions.uploader.clearQueue();
        //   return this.toasty.error(resp.message);
        // }
        // this.toasty.success('Your account has been created, please verify your email then login');
        // this.router.navigate(['/auth/login']);
        this.accountTutor.issueDocument = resp.data._id;
      },
      onFileSelect: resp => {
        const lastIndex = resp.length - 1;
        const file = resp[lastIndex].file;
        const ext = file.name.split('.').pop().toLowerCase();
        if (['pdf', 'doc', 'docx', 'zip', 'rar', 'jpg', 'jpeg', 'png'].indexOf(ext) === -1) {
          this.idDocumentOptions.uploader.clearQueue();
          return this.toasty.error('Invalid file type');
        }
        this.idDocumentFile = file;
      },
      // customFields: this.accountTutor,
      uploadOnSelect: true,
      id: 'id-document'
    };
    this.resumeOptions = {
      url: window.appConfig.apiBaseUrl + '/tutors/upload-document',
      onCompleteItem: resp => {
        this.accountTutor.resumeDocument = resp.data._id;
      },
      onFileSelect: resp => {
        const lastIndex = resp.length - 1;
        const file = resp[lastIndex].file;
        const ext = file.name.split('.').pop().toLowerCase();
        if (['pdf'].indexOf(ext) === -1) {
          this.resumeOptions.uploader.clearQueue();
          return this.toasty.error('Invalid file type');
        }
        this.resumeFile = file;
      },
      uploadOnSelect: true,
      id: 'id-resume'
    };
    this.certificationOptions = {
      url: window.appConfig.apiBaseUrl + '/tutors/upload-document',
      onCompleteItem: resp => {
        this.accountTutor.certificationDocument = resp.data._id;
      },
      onFileSelect: resp => {
        const lastIndex = resp.length - 1;
        const file = resp[lastIndex].file;
        const ext = file.name.split('.').pop().toLowerCase();
        if (['pdf'].indexOf(ext) === -1) {
          this.certificationOptions.uploader.clearQueue();
          return this.toasty.error('Invalid file type');
        }
        this.certificationFile = file;
      },
      uploadOnSelect: true,
      id: 'id-verification'
    };

    this.appConfig = this.route.snapshot.data.appConfig;
  }

  public onlyNumberKey(event) {
    return event.charCode === 8 || event.charCode === 0 ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  public async submit(frm: any) {
    this.submitted = true;
    if (frm.invalid) {
      return;
    }
    if (this.account.password !== this.confirm.pw) {
      this.isMath = true;
      return this.toasty.error('Confirm password and Password dont match');
    }
    if (this.account.type === '') {
      return this.toasty.error('Please select type');
    }

    if (this.account.type === 'tutor') {
      this.accountTutor.name = this.account.name;
      this.accountTutor.email = this.account.email;
      this.accountTutor.password = this.account.password;
      if (
        !this.accountTutor.issueDocument ||
        !this.accountTutor.resumeDocument ||
        !this.accountTutor.certificationDocument
      ) {
        return this.toasty.error('Please upload all documents');
      }
      return this.auth
        .registerTutor(this.accountTutor)
        .then(resp => {
          this.activeModal.close();
          this.toasty.success('Your account has been created, please verify your email then login');
          this.router.navigate(['/auth/login']);
        })
        .catch(err => this.toasty.error(err.data.message));
    }
    this.auth
      .register(this.account)
      .then(resp => {
        this.activeModal.close();
        this.toasty.success('Your account has been created, please verify your email then login');
        this.router.navigate(['/auth/login']);
      })
      .catch(err => this.toasty.error(err.data.data.message));
  }
}

@Component({
  selector: 'button-signup-component',
  templateUrl: 'button.html'
})
export class ButtonSignupComponent {
  @Input() text: string = '';
  constructor(private modalService: NgbModal) {}
  @Output() afterCancel = new EventEmitter();

  open() {
    const modalRef = this.modalService.open(ModalSignupComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });
    modalRef.result.then(
      res => {
        this.afterCancel.emit(res);
      },
      () => {}
    );
  }
}
