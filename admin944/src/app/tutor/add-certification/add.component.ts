import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { TutorService } from '../tutor.service';

interface ICertificate {
  _id?: string;
  title?: string;
  description?: string;
  fromYear: number;
  toYear: number;
  verified?: boolean;
  documentId?: string;
  ordering?: number;
  tutorId?: string;
  document?: any;
  type?: string;
}

@Component({
  selector: 'app-add-certification',
  templateUrl: './add.html'
})
export class AddCetificationComponent implements OnInit {
  @Input() certificate: ICertificate;
  @Input() type: any;
  @Input() tutorId: any;
  public submitted: boolean = false;
  public maxFileSize: number;
  public options: Object = {
    placeholderText: 'Enter description',
    charCounterCount: false,
    imageUpload: false
  };
  public mediaOptions: Object;

  constructor(private toasty: ToastrService, public activeModal: NgbActiveModal, private tutorService: TutorService) {
    this.maxFileSize = window.appConfig.maximumFileSize;
  }

  ngOnInit() {
    this.mediaOptions = {
      url: window.appConfig.apiBaseUrl + '/media/files',
      fileFieldName: 'file',
      onFinish: resp => {
        this.certificate.documentId = resp.data._id;
        this.certificate.document = resp.data;
      }
    };
    if (!this.certificate) {
      this.certificate = {
        title: '',
        description: '',
        fromYear: 1900,
        toYear: 1900,
        verified: false,
        documentId: '',
        ordering: 0,
        tutorId: '',
        type: '',
        document: null
      };
    }
  }

  submit(frm: any) {
    this.submitted = true;
    if (!frm.valid) {
      return this.toasty.error('Please complete the required fields!');
    }
    if (!this.certificate.documentId) {
      return this.toasty.error('Please upload document!');
    }
    if (this.certificate.toYear < 1900 || this.certificate.fromYear < 1900) {
      return this.toasty.error('From year and to year must be greater than or equal to 1900!');
    }
    if (this.certificate.ordering < 0) {
      return this.toasty.error('Ordering must be greater than or equal to 0!');
    }
    if (this.certificate.toYear < this.certificate.fromYear) {
      return this.toasty.error('To year must be greater than from year!');
    }

    this.certificate.tutorId = this.tutorId;
    this.certificate.type = this.type;
    const data = _.pick(this.certificate, [
      'title',
      'description',
      'fromYear',
      'toYear',
      'type',
      'documentId',
      'tutorId',
      'verified',
      'ordering'
    ]);
    if (this.certificate._id) {
      this.tutorService
        .updateCertificate(this.certificate._id, data)
        .then(resp => {
          this.activeModal.close(resp.data);
          this.submitted = false;
          this.toasty.success('Updated certificate successfully');
        })
        .catch(e => {
          this.toasty.error('Something went wrong, please try again!');
        });
    } else {
      this.tutorService
        .createCertificate(data)
        .then(resp => {
          this.activeModal.close(resp.data);
          this.submitted = false;
          this.toasty.success('Created certificate successfully!');
        })
        .catch(e => {
          this.toasty.error('Something went wrong, please try again!');
        });
    }
  }
}
