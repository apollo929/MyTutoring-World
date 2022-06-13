import { SeoService } from '../../shared/services/seo.service';
import { Component,Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/services';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AvatarUploadComponent } from '../../media/components/avatar-upload/avatar-upload.component';

import { CountryService } from '../../shared/services/country.service';

@Component({
  templateUrl: 'signup.component.html'
})
export class SignupComponent {
  public account: any = {
    email: '',
    password: '',
    name: '',
    type: '',
    timezone: ''
  };
  public accountTutor: any = {
    email: '',
    password: '',
    name: '',
    bio: '',
    timezone: '',
    introVideoId: '',
    avatar: '',
    introYoutubeId: '',
    country: '',
  };

  public quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['code-block'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ font: [] }],
        [{ align: [] }],

        ['clean']
        // ['image']
      ]
    },
    keyboard: {
      bindings: {
        enter: {
          key: 13,
          handler: (range, context) => {
            return true;
          }
        }
      }
    }
  };
  @Output() afterCancel = new EventEmitter();
  public introVideoType: string = 'upload';
  public confirm: any = {
    pw: ''
  };
  public checkAvatar: boolean;
  public maxFileSize: number;
  public isMath: boolean = false;
  public submitted: boolean = false;
  public idDocumentOptions: any = {};
  public resumeOptions: any = {};
  public certificationOptions: any = {};
  public introVideoOptions: any = {};
  public introImageOptions: any = {};
  public idDocumentFile: any;
  public resumeFile: any;
  public certificationFile: any;
  public introVideo: any;
  public introImage: any;
  public appConfig: any;
  public loading: boolean = false;
  public agree: boolean = true;
  public countries: any;

  constructor(
    private auth: AuthService,
    public router: Router,
    private toasty: ToastrService,
    private route: ActivatedRoute,
    private seoService: SeoService,
    private translate: TranslateService,
    private countryService: CountryService,
    private modalService: NgbModal,
  ) {
    this.maxFileSize = window.appConfig.maximumFileSize;
    this.appConfig = this.route.snapshot.data.appConfig;
    if (this.appConfig) {
      let title = this.appConfig.siteName + ' - Sign Up';
      seoService.update(title);
    }

    this.introVideoOptions = {
      url: window.appConfig.apiBaseUrl + '/tutors/upload-introVideo',
      onCompleteItem: resp => {
        this.accountTutor.introVideoId = resp.data._id;
        this.loading = false;
      },
      onFileSelect: resp => {
        const lastIndex = resp.length - 1;
        const file = resp[lastIndex].file;
        const ext = file.name.split('.').pop().toLowerCase();
        if (['mp4', 'webm', '3gp', 'ogg', 'wmv', 'webm'].indexOf(ext) === -1) {
          this.introVideoOptions.uploader.clearQueue();
          return this.toasty.error(this.translate.instant('Invalid file type'));
        }
        this.introVideo = file;
      },
      uploadOnSelect: true,
      id: 'id-introVideo',
      onUploading: resp => (this.loading = true)
    };
    
    this.introImageOptions = {
      url: window.appConfig.apiBaseUrl + '/tutors/upload-introImage',
      onCompleteItem: resp => {
        this.accountTutor.avatar = "/avatar/" + resp.data.name;
        this.loading = false;
      },
      onFileSelect: resp => {
        const lastIndex = resp.length - 1;
        const file = resp[lastIndex].file;
        const ext = file.name.split('.').pop().toLowerCase();
        if (['jpg', 'png', 'jpeg'].indexOf(ext) === -1) {
          this.introImageOptions.uploader.clearQueue();
          return this.toasty.error(this.translate.instant('Invalid file type'));
        }
        this.introImage = file;
      },
      uploadOnSelect: true,
      id: 'id-introImage',
      onUploading: resp => (this.loading = true)
    };

    // this.idDocumentOptions = {
    //   url: window.appConfig.apiBaseUrl + '/tutors/upload-document',
    //   onCompleteItem: resp => {
    //     this.accountTutor.issueDocument = resp.data._id;
    //     this.loading = false;
    //   },
    //   onFileSelect: resp => {
    //     const lastIndex = resp.length - 1;
    //     const file = resp[lastIndex].file;
    //     const ext = file.name.split('.').pop().toLowerCase();
    //     if (['pdf', 'doc', 'docx', 'zip', 'rar', 'jpg', 'jpeg', 'png'].indexOf(ext) === -1) {
    //       this.idDocumentOptions.uploader.clearQueue();
    //       return this.toasty.error('Invalid file type');
    //     }
    //     this.idDocumentFile = file;
    //   },
    //   uploadOnSelect: true,
    //   id: 'id-document',
    //   onUploading: resp => (this.loading = true)
    // };
    // this.resumeOptions = {
    //   url: window.appConfig.apiBaseUrl + '/tutors/upload-document',
    //   onCompleteItem: resp => {
    //     this.accountTutor.resumeDocument = resp.data._id;
    //     this.loading = false;
    //   },
    //   onFileSelect: resp => {
    //     const lastIndex = resp.length - 1;
    //     const file = resp[lastIndex].file;
    //     const ext = file.name.split('.').pop().toLowerCase();
    //     if (['pdf'].indexOf(ext) === -1) {
    //       this.resumeOptions.uploader.clearQueue();
    //       return this.toasty.error('Invalid file type');
    //     }
    //     this.resumeFile = file;
    //   },
    //   uploadOnSelect: true,
    //   id: 'id-resume',
    //   onUploading: resp => (this.loading = true)
    // };
    // this.certificationOptions = {
    //   url: window.appConfig.apiBaseUrl + '/tutors/upload-document',
    //   onCompleteItem: resp => {
    //     this.accountTutor.certificationDocument = resp.data._id;
    //     this.loading = false;
    //   },
    //   onFileSelect: resp => {
    //     const lastIndex = resp.length - 1;
    //     const file = resp[lastIndex].file;
    //     const ext = file.name.split('.').pop().toLowerCase();
    //     if (['pdf'].indexOf(ext) === -1) {
    //       this.certificationOptions.uploader.clearQueue();
    //       return this.toasty.error('Invalid file type');
    //     }
    //     this.certificationFile = file;
    //   },
    //   uploadOnSelect: true,
    //   id: 'id-verification',
    //   onUploading: resp => (this.loading = true)
    // };
  }

  open() {
    console.log('----');
    const modalRef = this.modalService.open(AvatarUploadComponent, { centered: true, backdrop: 'static' });
    // const modalRef = this.modalService.open(AvatarUploadComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.info = this.account;
    modalRef.result.then(
      res => {
        this.afterCancel.emit(res);
        this.account.avatarUrl = res;
        this.checkAvatar = true;
      },
      () => {}
    );
  }

  async ngOnInit() {
    this.countries = this.countryService.getCountry();
  }

  public onlyNumberKey(event) {
    return event.charCode === 8 || event.charCode === 0 ? null : event.charCode >= 48 && event.charCode <= 57;
  }


  public async submit(frm: any) {
    this.submitted = true;
    if (frm.invalid) {
      return;
    }
    if (!this.account.timezone) {
      return this.toasty.error(this.translate.instant('Please select timezone'));
    }
    if (this.account.password !== this.confirm.pw) {
      this.isMath = true;
      return this.toasty.error(this.translate.instant('Confirm password and password dont match'));
    }
    if (this.account.type === '') {
      return this.toasty.error(this.translate.instant('Please select type'));
    }

    this.account.email = this.account.email.toLowerCase();

    if (this.account.type === 'tutor') {
      this.accountTutor.name = this.account.name;
      this.accountTutor.email = this.account.email;
      this.accountTutor.password = this.account.password;
      this.accountTutor.timezone = this.account.timezone;
      this.accountTutor.country = this.account.country;
      // if (this.introVideoType == 'youtube' && !this.accountTutor.introYoutubeId) {
      //   console.log(this.accountTutor.introYoutubeId);

      //   return this.toasty.error(this.translate.instant('Please enter introduction youtube ID');
      // }
      if (this.introVideoType == 'upload' && !this.accountTutor.introVideoId) {
        return this.toasty.error(this.translate.instant('Please upload introduction video'));
      }
      if (this.introVideoType === 'youtube') {
        this.accountTutor.introVideoId = null;
      }

      // if (
      //   !this.accountTutor.issueDocument ||
      //   !this.accountTutor.resumeDocument ||
      //   !this.accountTutor.certificationDocument
      // ) {
      //   return this.toasty.error('Please upload all documents');
      // }
      return this.auth
        .registerTutor(this.accountTutor)
        .then(resp => {
          this.toasty.success(
            this.translate.instant('Your account has been created, please verify your email then login')
          );
          this.router.navigate(['/auth/login']);
        })
        .catch(err => this.toasty.error(this.translate.instant(err.data.message)));
    }
    this.auth
      .register(this.account)
      .then(resp => {
        this.toasty.success(
          this.translate.instant('Your account has been created, please verify your email then login')
        );
        this.router.navigate(['/auth/login']);
      })
      .catch(err => this.toasty.error(this.translate.instant(err.data.data.message)));
  }

  changeTimezone(event) {
    if (event === 'Asia/Saigon') {
      this.account.timezone = 'Asia/Ho_Chi_Minh';
    } else {
      this.account.timezone = event;
    }
  }

  changeUploadType(event) {
    if (event.target.value === 'youtube') {
      this.accountTutor.introYoutubeId = 'ZU0gjnRU-Z4';
    } else {
      this.accountTutor.introYoutubeId = '';
    }
  }
}
