import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CouponCreateComponent } from './create/create.component';
import { CouponListingComponent } from './list/list.component';
import { CouponUpdateComponent } from './update/update.component';

const routes: Routes = [
  {
    path: 'list',
    component: CouponListingComponent,
    data: {
      title: 'Coupons manager',
      urls: [{ title: 'Coupons', url: '/coupons/list' }, { title: 'Listing' }]
    }
  },
  {
    path: 'update/:id',
    component: CouponUpdateComponent,
    data: {
      title: 'Coupons Update',
      urls: [{ title: 'Coupons', url: '/coupons/list' }, { title: 'Update' }]
    }
  },
  {
    path: 'create',
    component: CouponCreateComponent,
    data: {
      title: 'Create New Coupon',
      urls: [{ title: 'Coupons', url: '/coupons/list' }, { title: 'Create' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponRoutingModule { }
