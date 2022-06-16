import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoryRoutingModule } from './category.routing';
import { MediaModule } from '../media/media.module';

import { CategoryCreateComponent } from './create/create.component';
import { CategoryListingComponent } from './list/list.component';
import { CategoryUpdateComponent } from './update/update.component';

import { CategoryService } from './category.service';
import { SubjectModule } from '../subject/subject.module';

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, CategoryRoutingModule, MediaModule, SubjectModule],
  declarations: [CategoryCreateComponent, CategoryListingComponent, CategoryUpdateComponent],
  providers: [CategoryService],
  exports: [],
  entryComponents: []
})
export class CategoryModule {}
