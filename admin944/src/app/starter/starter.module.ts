import { starterService } from './starter.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { StarterComponent } from './starter.component';
import { MediaModule } from '../media/media.module';
import { ConfigResolver } from '../shared/resolver';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Dashboard',
      urls: [{ title: 'Dashboard', url: '/starter' }, { title: 'Admin dashboard' }]
    },
    component: StarterComponent,
    resolve: {
      appConfig: ConfigResolver
    }
  }
];

@NgModule({
  imports: [FormsModule, CommonModule, RouterModule.forChild(routes), MediaModule],
  declarations: [StarterComponent],
  providers: [starterService]
})
export class StarterModule {}
