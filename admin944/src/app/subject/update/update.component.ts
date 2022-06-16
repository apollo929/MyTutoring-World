import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../subject.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { CategoryService } from '../../category/category.service';

@Component({
  selector: 'app-subject-update',
  templateUrl: '../form.html'
})
export class SubjectUpdateComponent implements OnInit {
  public maxFileSize: number;
  public subject: any = {};
  public isSubmitted: Boolean = false;
  public iconId: string = '';
  public subjectId: string;
  public iconUrl: string;
  public mainImageUrl: string = '';
  public mainImageOptions: any;
  public imageSelected: any[] = [];
  public categories: any = [];
  constructor(
    private router: Router,
    private subjectService: SubjectService,
    private toasty: ToastrService,
    private route: ActivatedRoute,
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
    this.subjectId = this.route.snapshot.paramMap.get('id');

    this.subjectService.findOne(this.subjectId).then(resp => {
      this.subject = _.pick(resp.data, ['name', 'alias', 'description', 'price', 'categoryIds', 'isActive']);
      this.mainImageUrl = resp.data.image ? resp.data.image.thumbUrl : '/assets/images/icon/income.png';
    });
  }

  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid) {
      return this.toasty.error('Something went wrong, please check and try again!');
    }
    this.subjectService
      .update(this.subjectId, this.subject)
      .then(resp => {
        this.toasty.success('Updated successfuly!');
        this.router.navigate(['/subjects/list']);
      })
      .catch(err => this.toasty.error(err.data.data.message || err.data.data.email));
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
