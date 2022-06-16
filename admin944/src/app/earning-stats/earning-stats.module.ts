import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentModule } from '../appointment/appointment.module';

import { ListingComponent, DetailEarningComponent } from './components';

import { EarningStatsService } from './services/earning-stats.service';

const routes: Routes = [
  {
    path: 'stats',
    component: ListingComponent,
    data: {
      title: 'Earning Stats',
      urls: [{ title: 'Earning Stats' }]
    }
  },
  {
    path: 'stats/:tutorId',
    component: DetailEarningComponent,
    data: {
      title: 'Earning Stats',
      urls: [{ title: 'Earning Stats' }]
    }
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), NgbModule, AppointmentModule],
  declarations: [ListingComponent, DetailEarningComponent],
  providers: [EarningStatsService],
  exports: []
})
export class EarningStatsModule {}
