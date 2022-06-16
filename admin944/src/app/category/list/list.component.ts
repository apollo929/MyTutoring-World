import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { pick } from 'lodash';

@Component({
  selector: 'app-category-listing',
  templateUrl: './list.html'
})
export class CategoryListingComponent implements OnInit {
  public count: number = 0;
  public items = [];
  public currentPage: Number = 1;
  public pageSize: Number = 10;
  public searchFields: any = {};
  public sortOption = {
    sortBy: 'ordering',
    sortType: 'asc'
  };
  public updating: boolean = false;

  constructor(private router: Router, private categoryService: CategoryService, private toasty: ToastrService) {}

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
    this.categoryService
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
    if (window.confirm('Are you sure want to delete this category?')) {
      this.categoryService
        .delete(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.items.splice(index, 1);
          this.count--;
        })
        .catch(() => this.toasty.error('Something went wrong, please try again!'));
    }
  }

  update(category: any) {
    const cat = pick(category, ['name', 'alias', 'description', 'ordering', 'isActive', 'imageId']);
    cat.isActive = !category.isActive;
    if (!this.updating) {
      this.updating = true;
      this.categoryService
        .update(category._id, cat)
        .then(resp => {
          category.isActive = cat.isActive;
          this.updating = false;
          if (cat.isActive) this.toasty.success('Activated!');
          else this.toasty.success('Deactivated!');
        })
        .catch(err => {
          this.updating = false;
          return this.toasty.error(err.data.data.message);
        });
    }
  }
}
