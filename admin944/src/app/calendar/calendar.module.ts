import { TutorService } from './../tutor/tutor.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { FullCalendarModule } from 'ng-fullcalendar';
import { CalendarService } from './services/calendar.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { ScheduleEditComponent } from './components';

FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]);

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, FullCalendarModule],
  declarations: [ScheduleEditComponent],
  providers: [CalendarService, TutorService],
  exports: [ScheduleEditComponent],
  entryComponents: []
})
export class CalendarModule {}
