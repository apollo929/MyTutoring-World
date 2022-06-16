import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../../services/language.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { pick } from 'lodash';
@Component({
  templateUrl: 'languages.html'
})
export class LanguagesComponent implements OnInit {
  public items = [];
  public page = 1;
  public total: number = 0;

  constructor(
    private router: Router,
    private service: LanguageService,
    private toasty: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.query();
  }

  query() {
    this.service
      .search({
        page: this.page
      })
      .then(resp => {
        this.items = resp.data.items;
        this.total = resp.data.count;
      })
      .catch(() => alert('Something went wrong, please try again!'));
  }

  remove(item: any, index: number) {
    if (window.confirm('Are you sure want to delete this language?')) {
      this.service
        .remove(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.items.splice(index, 1);
          this.total--;
        })
        .catch(err => this.toasty.error(err.data.message || 'Something went wrong, please try again!'));
    }
  }

  addNew(lang: any = {}) {
    const modalRef = this.modalService.open(NewLanguageModalComponent, {
      size: 'sm'
    });
    if (lang) {
      modalRef.componentInstance.lang = lang;
    }
    modalRef.result.then(
      result => {
        if (!lang._id) {
          this.items.push(result);
          this.total++;
          return this.toasty.success('New language as been added');
        }
        this.toasty.success('Updated');
      },
      () => null
    );
  }

  update(item: any, field: any, status: Boolean) {
    const update = item;
    update[field] = status;
    this.service
      .update(item._id, pick(update, ['isDefault', 'isActive', 'key', 'name', 'flag']))
      .then(resp => {
        item[field] = status;
        if (field === 'isDefault' && status) {
          this.items.forEach(i => {
            i.isDefault = i._id === item._id;
          });
        }
      })
      .catch(e => this.toasty.error('Something went wrong, please try again later!'));
  }
}

@Component({
  templateUrl: 'new-language-modal.html'
})
export class NewLanguageModalComponent implements OnInit {
  @Input() lang: any = {
    isDefault: false,
    isActive: false,
    name: '',
    key: '',
    flag: '',
    countryCode: '',
    jsonId: null
  };
  // public newLang: any = {
  //   isDefault: false,
  //   isActive: false,
  //   name: '',
  //   key: ''
  // };
  public langs: any = [];
  public isoLangs: any = {};
  public submitted: Boolean = false;
  public jsonOptions: any;
  public filesSelected: any;
  public jsonFile: any;

  constructor(
    private router: Router,
    private service: LanguageService,
    private toasty: ToastrService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.jsonOptions = {
      url: window.appConfig.apiBaseUrl + '/media/files',
      fileFieldName: 'file',
      onFinish: resp => {
        if (resp.data && resp.data._id) {
          this.lang.jsonId = resp.data._id;
          this.jsonFile = resp.data;
          this.toasty.success('Uploaded successfully!');
        }
      },
      onFileSelect: resp => (this.filesSelected = resp),
      accept: '.json'
    };
    this.isoLangs = this.service.isoLangs.map(item =>
      Object.assign(item, {
        text: item.name + ' - ' + item.language.name
      })
    );
    //this.langs = Object.keys(this.service.isoLangs);
  }

  create(frm: any) {
    this.submitted = true;
    if (frm.invalid) {
      return;
    }

    if (this.lang._id) {
      this.service
        .update(
          this.lang._id,
          pick(this.lang, ['isDefault', 'isActive', 'key', 'name', 'flag', 'jsonId', 'countryCode'])
        )
        .then(resp => this.activeModal.close(resp.data))
        .catch(err =>
          this.toasty.error(
            err.data.data && err.data.data.message ? err.data.data.message : 'Something went wrong, please try again!'
          )
        );
    } else {
      this.service
        .create(this.lang)
        .then(resp => {
          this.activeModal.close(resp.data);
        })
        .catch(err =>
          this.toasty.error(
            err.data.data && err.data.data.message ? err.data.data.message : 'Something went wrong, please try again!'
          )
        );
    }
  }
  changeLang(event) {
    this.lang.name = event.language.code.toUpperCase();
    this.lang.key = event.language.code;
    this.lang.flag = event.flag;
    this.lang.countryCode = event.code;
  }
}
