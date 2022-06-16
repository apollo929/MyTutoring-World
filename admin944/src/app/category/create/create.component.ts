import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: '../form.html'
})
export class CategoryCreateComponent implements OnInit {
  public category: any = {
    name: '',
    alias: '',
    description: '',
    ordering: 0,
    imageId: null,
    isActive: true
  };
  public isSubmitted: Boolean = false;
  public mainImageUrl: String = '';
  public mainImageOptions: any;
  public imageSelected: any[] = [];
  public maxFileSize: number;
  public categoryId: string = null;

  constructor(private router: Router, private categoryService: CategoryService, private toasty: ToastrService) {
    this.maxFileSize = window.appConfig.maximumFileSize;
  }

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
  }

  submit(frm: any) {
    if (!frm.valid) {
      return this.toasty.error('Invalid form, please try again.');
    }
    if (!this.category.imageId) {
      return this.toasty.error('Please select image');
    }
    this.isSubmitted = true;
    this.categoryService.create(this.category).then(
      () => {
        this.toasty.success('Category has been created');
        this.router.navigate(['/categories/list']);
      },
      err => this.toasty.error(err.data.message || 'Something went wrong!')
    );
  }
}
