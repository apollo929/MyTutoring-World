import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BannersComponent, BrandCreateComponent, BrandUpdateComponent } from './banners.component';

import { BannerService } from './service';

import { MediaModule } from '../media/media.module';

const routes: Routes = [
  {
    path: '',
    component: BannersComponent,
    data: {
      title: 'Manage banners',
      urls: [{ title: 'Banners', url: '/banners' }, { title: 'Listing' }]
    }
  },
  {
    path: 'create',
    component: BrandCreateComponent,
    data: {
      title: 'Manage banners',
      urls: [{ title: 'Banners', url: '/banners' }, { title: 'Create new banner' }]
    }
  },
  {
    path: 'update/:id',
    component: BrandUpdateComponent,
    data: {
      title: 'Manage banners',
      urls: [{ title: 'Banners', url: '/banners' }, { title: 'Update banner' }]
    }
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, MediaModule, RouterModule.forChild(routes)],
  declarations: [BannersComponent, BrandCreateComponent, BrandUpdateComponent],
  providers: [BannerService],
  exports: [],
  entryComponents: []
})
export class BannerModule {}
