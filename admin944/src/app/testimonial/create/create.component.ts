import { Component, OnInit } from '@angular/core';
import { TestimonialService } from '../testimonial.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: '../form.html'
})
export class TestimonialCreateComponent implements OnInit {
  public maxFileSize: number;
  public testimonial: any = {
    name: '',
    title: '',
    idYoutube: '',
    description: '',
    type: 'parent',
    imageId: null
  };
  public isSubmitted: Boolean = false;
  public imageUrl: String = '';
  public mainImageOptions: any;
  public imageSelected: any[] = [];
  constructor(private router: Router, private testimonialService: TestimonialService, private toasty: ToastrService) {
    this.maxFileSize = window.appConfig.maximumFileSize;
  }

  ngOnInit() {
    this.mainImageOptions = {
      url: window.appConfig.apiBaseUrl + '/media/photos',
      fileFieldName: 'file',
      onFinish: resp => {
        this.testimonial.imageId = resp.data._id;
        this.imageUrl = resp.data.fileUrl;
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
    this.testimonialService.create(this.testimonial).then(
      () => {
        this.toasty.success('Testimonial has been created');
        this.router.navigate(['/testimonials/list']);
      },
      err => this.toasty.error(err.data.message || 'Something went wrong!')
    );
  }
}
