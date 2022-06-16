import { Component, OnInit } from '@angular/core';
import { TestimonialService } from '../testimonial.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
  selector: 'app-testimonial-update',
  templateUrl: '../form.html'
})
export class TestimonialUpdateComponent implements OnInit {
  public maxFileSize: number;
  public testimonial: any = {};
  public isSubmitted: Boolean = false;
  private testimonialId: String;
  public imageUrl: String = '';
  public mainImageOptions: any;
  public imageSelected: any[] = [];
  constructor(
    private router: Router,
    private testimonialService: TestimonialService,
    private toasty: ToastrService,
    private route: ActivatedRoute
  ) {
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
    this.testimonialId = this.route.snapshot.paramMap.get('id');

    this.testimonialService.findOne(this.testimonialId).then(resp => {
      this.testimonial = _.pick(resp.data, ['name', 'title', 'description', 'idYoutube', 'type', 'imageId']);
      this.imageUrl = resp.data.image.fileUrl;
    });
  }

  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid) {
      return this.toasty.error('Something went wrong, please check and try again!');
    }
    this.testimonialService
      .update(this.testimonialId, this.testimonial)
      .then(resp => {
        this.toasty.success('Updated successfuly!');
        this.router.navigate(['/testimonials/list']);
      })
      .catch(err => this.toasty.error(err.data.data.message || err.data.data.email));
  }
}
