import { Component, OnInit } from '@angular/core';
import { TestimonialService } from '../testimonial.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-testimonial-listing',
  templateUrl: './listing.html'
})
export class TestimonialListingComponent implements OnInit {
  public count: number = 0;
  public items = [];
  public currentPage: Number = 1;
  public pageSize: Number = 10;
  public searchFields: any = {};
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };

  constructor(private router: Router, private testimonialService: TestimonialService, private toasty: ToastrService) {}

  ngOnInit() {
    this.query();
  }

  query() {
    const params = Object.assign(
      {
        page: this.currentPage,
        take: this.pageSize,
        sort: `${this.sortOption.sortBy}`,
        sortType: `${this.sortOption.sortType}`
      },
      this.searchFields
    );
    this.testimonialService
      .search(params)
      .then(resp => {
        this.count = resp.data.count;
        this.items = resp.data.items;
      })
      .catch(() => alert('Something went wrong, please try again!'));
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }

  remove(item: any, index: number) {
    if (window.confirm('Are you sure want to delete this testimonial?')) {
      this.testimonialService
        .delete(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.items.splice(index, 1);
          this.count--;
        })
        .catch(() => this.toasty.error('Something went wrong, please try again!'));
    }
  }
}
