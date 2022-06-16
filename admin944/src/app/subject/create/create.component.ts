import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../subject.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../category/category.service';

@Component({
  templateUrl: '../form.html'
})
export class SubjectCreateComponent implements OnInit {
  public maxFileSize: number;
  public subject: any = {
    name: '',
    alias: '',
    description: '',
    categoryIds: [],
    isActive: true
  };
  public isSubmitted: Boolean = false;
  public iconUrl: String = '';
  public mainImageUrl: String = '';
  public mainImageOptions: any;
  public imageSelected: any[] = [];
  public categories: any = [];
  public subjectId: string = null;
  constructor(
    private router: Router,
    private subjectService: SubjectService,
    private toasty: ToastrService,
    private categoryService: CategoryService
  ) {
    this.maxFileSize = window.appConfig.maximumFileSize;
  }

  ngOnInit() {
    this.queryCategories();
    this.mainImageOptions = {
      url: window.appConfig.apiBaseUrl + '/media/photos',
      fileFieldName: 'file',
      onFinish: resp => {
        this.subject.imageId = resp.data._id;
        this.mainImageUrl = resp.data.fileUrl;
      },
      onFileSelect: resp => (this.imageSelected = resp),
      accept: 'image/*'
    };
  }

  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid) {
      return this.toasty.error('Invalid form, please try again.');
    }
    this.subjectService.create(this.subject).then(
      () => {
        this.toasty.success('Subject has been created');
        this.router.navigate(['/subjects/list']);
      },
      err => this.toasty.error(err.data.message || 'Something went wrong!')
    );
  }

  queryCategories() {
    this.categoryService.search({ take: 100 }).then(
      resp => {
        this.categories = resp.data.items;
      },
      err => this.toasty.error('Something went wrong, please try again!')
    );
  }
}
