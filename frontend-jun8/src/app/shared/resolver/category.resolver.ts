import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { CategoryService } from '../services';

@Injectable()
export class CategoryResolver implements Resolve<Observable<any>> {
  constructor(private categoryService: CategoryService) {}

  resolve(): any {
    return this.categoryService
      .getCategories({ take: 1000, isActive: true, sort: 'ordering', sortType: 'asc' })
      .then(resp => resp.data && resp.data.items);
  }
}
