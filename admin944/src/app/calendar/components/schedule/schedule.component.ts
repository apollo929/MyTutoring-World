import { TutorService } from './../../../tutor/tutor.service';
import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as momentTimezone from 'moment-timezone';
import { CalendarService } from '../../services/calendar.service';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  CalendarApi,
  FullCalendarComponent,
  EventInput,
  Calendar
} from '@fullcalendar/angular';
import { responseError } from '../../../shared/util';
// import ptBrLocale from '@fullcalendar/core/locales/pt-br';
@Component({
  selector: 'app-schedule-calendar',
  templateUrl: './schedule.html'
})
export class ScheduleEditComponent implements OnInit {
  @Input() webinarId: string = '';
  @Input() hashWebinar: string = '';
  @Input() tutorId: string = '';
  @Input() tutorTz = '';
  public today = moment();
  public getMonth = moment().get('month');
  public month = moment().set('month', this.getMonth);
  public day: any;
  public date: any = [];
  public i: any;
  public showTime: any;
  public startTime: any;
  public toTime: any;
  public events: any[];
  public calendarEvents: EventInput[] = [];
  public eventsCalendar: any[] = [];
  public calendarVisible = true;
  public calendarOptions: CalendarOptions = {
    editable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    initialEvents: [],
    selectable: true,
    initialView: 'timeGridWeek',
    eventOverlap: false,
    // locale: ptBrLocale,
    locale: 'en',
    select: this.select.bind(this),
    eventClick: this.eventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDrop: this.updateEvent.bind(this),
    datesSet: this.loadInitialEvents.bind(this),
    eventResize: this.updateEvent.bind(this),
    eventAllow: this.dragAllow.bind(this)
  };
  public currentEvents: EventApi[] = [];
  public calendarApi: Calendar;
  public initialized = false;

  @ViewChild('calendar', { static: true }) calendarComponent: FullCalendarComponent;

  constructor(private calendar: CalendarService, private toasty: ToastrService, private tutorService: TutorService) {}

  ngOnInit() {}

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  dragAllow(dropInfo, _) {
    const startTime = new Date(dropInfo.start);
    if (moment().isAfter(startTime)) {
      this.toasty.error('Cannot update slot in the past!');
      return false;
    }
    const toTime = new Date(dropInfo.end);
    const duration = moment.duration((moment(toTime).unix() - moment(startTime).unix()) * 1000);
    if ((duration.minutes() > 0 && duration.hours() === 1) || duration.hours() > 1) {
      this.toasty.error('Maximum time allowed is 1 hour!');
      return false;
    }
    return true;
  }

  loadInitialEvents($event: CalendarApi) {
    this.calendarEvents = [];
    const calendarApi = $event.view.calendar;
    calendarApi.removeAllEvents();
    this.calendar
      .search({
        startTime: new Date($event.view.activeStart).toISOString(),
        toTime: new Date($event.view.activeEnd).toISOString(),
        webinarId: this.webinarId || '',
        take: 10000,
        hashWebinar: this.hashWebinar || '',
        tutorId: this.tutorId || ''
      })
      .then(resp => {
        this.events = resp.data.items;
        this.events.forEach(e => {
          const calendarevent = {
            start: new Date(e.startTime),
            end: new Date(e.toTime),
            item: e
          };
          this.calendarEvents.push(calendarevent);
        });
        calendarApi.addEventSource(this.calendarEvents);
      });
  }

  eventClick($event: EventClickArg) {
    const calendarApi = $event.view.calendar;
    if (window.confirm('Do you want to delete event?')) {
      const item = $event.event.extendedProps.item;
      this.calendar
        .delete(item.id)
        .then(() => {
          $event.event.remove();
          this.toasty.success('Deleted');
        })
        .catch(e => this.toasty.error(responseError(e)));
    }
  }

  updateEvent($event: any) {
    const oldEvent = {
      start: $event.oldEvent.start,
      end: $event.oldEvent.end,
      item: $event.oldEvent.extendedProps.item
    };
    const calendarApi = $event.view.calendar;
    const item = $event.event.extendedProps.item;
    const dtsStartTime = new Date($event.event.start);
    if (moment().isAfter(dtsStartTime)) {
      return this.toasty.error('Cannot update slot in the past!');
    }
    let dtsToTime = new Date($event.event.end);

    const duration = moment.duration((moment(dtsToTime).unix() - moment(dtsStartTime).unix()) * 1000);
    if (duration.minutes() < 30) {
      dtsToTime = moment($event.event.end).toDate();
    }
    if ((duration.minutes() > 0 && duration.hours() === 1) || duration.hours() > 1) {
      return this.toasty.error('Maximum time allowed is 1 hour!');
    }

    let startTime = dtsStartTime;
    let toTime = dtsToTime;
    let isDST = false;
    if (moment($event.event.start).isDST()) {
      isDST = true;
      startTime = moment($event.event.start).subtract(1, 'hour').toDate();
      toTime = moment($event.event.end).subtract(1, 'hour').toDate();
    }
    this.calendar
      .update(item._id, {
        startTime,
        toTime,
        dtsStartTime,
        dtsToTime,
        webinarId: this.webinarId,
        hashWebinar: this.hashWebinar || '',
        isDST
      })
      .then(resp => {
        const el = {
          start: dtsStartTime,
          end: dtsToTime,
          item
        };
        for (let index = 0; index < this.calendarEvents.length; index++) {
          if (this.calendarEvents[index].item._id === item._id) {
            this.calendarEvents[index] = el;
          }
        }
        this.toasty.success('Updated');
      })
      .catch(e => {
        for (let index = 0; index < this.calendarEvents.length; index++) {
          if (this.calendarEvents[index].item._id === item._id) {
            this.calendarEvents[index] = oldEvent;
          }
        }
        calendarApi.removeAllEvents();
        calendarApi.addEventSource(this.calendarEvents);
        this.toasty.error(e.data ? e.data.message : e.message);
      });
  }

  select($event: DateSelectArg) {
    if (!this.tutorId) {
      return this.toasty.error('Please choose tutor first!');
    }
    const dtsStartTime = moment($event.start).toDate();
    const calendarApi = $event.view.calendar;
    if (moment().isAfter(dtsStartTime)) {
      return this.toasty.error('Cannot create slot in the past!');
    }
    let dtsToTime = moment($event.end).toDate();

    const duration = moment.duration((moment(dtsToTime).unix() - moment(dtsStartTime).unix()) * 1000);
    if ((duration.minutes() > 0 && duration.hours() === 1) || duration.hours() > 1) {
      return this.toasty.error('Maximum time allowed is 1 hour!');
    }
    let isDST = false;
    let startTime = dtsStartTime;
    let toTime = dtsToTime;
    if (moment($event.start).isDST()) {
      isDST = true;
      startTime = moment($event.start).subtract(1, 'hour').toDate();
      toTime = moment($event.end).subtract(1, 'hour').toDate();
    }

    this.calendar
      .create({
        startTime,
        toTime,
        dtsToTime,
        dtsStartTime,
        webinarId: this.webinarId || '',
        hashWebinar: this.hashWebinar || '',
        tutorId: this.tutorId,
        isDST
      })
      .then(resp => {
        calendarApi.addEvent({
          item: resp.data,
          start: dtsStartTime,
          end: dtsToTime
        });
        this.toasty.success('Created successfully');
      })
      .catch(e => {
        this.toasty.error(responseError(e));
      });
  }
}
