import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestimonialCreateComponent } from './create/create.component';
import { TestimonialListingComponent } from './list/listing.component';
import { TestimonialUpdateComponent } from './update/update.component';

const routes: Routes = [
  {
    path: 'list',
    component: TestimonialListingComponent,
    data: {
      title: 'Testimonials manager',
      urls: [{ title: 'Testimonials', url: '/testimonials/list' }, { title: 'Listing' }]
    }
  },
  {
    path: 'update/:id',
    component: TestimonialUpdateComponent,
    data: {
      title: 'Testimonials Update',
      urls: [{ title: 'Testimonials', url: '/testimonials/list' }, { title: 'Update' }]
    }
  },
  {
    path: 'create',
    component: TestimonialCreateComponent,
    data: {
      title: 'Create New Testimonial',
      urls: [{ title: 'Testimonials', url: '/testimonials/list' }, { title: 'Create' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestimonialRoutingModule {}
