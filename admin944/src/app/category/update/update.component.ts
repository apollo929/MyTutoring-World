import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
  selector: 'app-category-update',
  templateUrl: '../form.html'
})
export class CategoryUpdateComponent implements OnInit {
  public category: any = {};
  public isSubmitted: Boolean = false;
  public categoryId: string;
  public mainImageUrl: string = '';
  public mainImageOptions: any;
  public imageSelected: any[] = [];
  public maxFileSize: number;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private toasty: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.mainImageOptions = {
      url: window.appConfig.apiBaseUrl + '/media/photos',
      fileFieldName: 'file',
      onFinish: resp => {
        this.category.imageId = resp.data._id;
        this.mainImageUrl = resp.data.fileUrl;
      },
      onFileSelect: resp => (this.imageSelected = resp),
      accept: 'image/*'
    };
    this.categoryId = this.route.snapshot.paramMap.get('id');

    this.categoryService.findOne(this.categoryId).then(resp => {
      this.category = _.pick(resp.data, ['name', 'alias', 'description', 'ordering', 'isActive', 'imageId']);
      this.mainImageUrl = resp.data.image ? resp.data.image.thumbUrl : '/assets/images/icon/income.png';
    });
  }

  submit(frm: any) {
    if (!frm.valid) {
      return this.toasty.error('Invalid form, please try again.');
    }
    this.isSubmitted = true;
    this.categoryService
      .update(this.categoryId, this.category)
      .then(resp => {
        this.toasty.success('Updated successfuly!');
        this.router.navigate(['/categories/list']);
      })
      .catch(err => this.toasty.error(err.data.data.message || err.data.data.email));
  }
}
