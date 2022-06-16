import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ReviewTutorComponent, StarRatingComponent, ReviewUpdateComponent } from './components';
import { ReviewService } from './services/review.service';

const routes: Routes = [];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, NgbModule],
  declarations: [ReviewTutorComponent, StarRatingComponent, ReviewUpdateComponent],
  providers: [ReviewService],
  exports: [ReviewTutorComponent, StarRatingComponent],
  entryComponents: [ReviewUpdateComponent]
})
export class ReviewModule {}
