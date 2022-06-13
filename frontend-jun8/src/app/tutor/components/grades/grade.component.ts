import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { IGrade } from '../../../user/interface';
@Component({
  selector: 'grade-tutor',
  template: `
    <select class="custom-select" [(ngModel)]="searchFields.grade" (change)="gradeChange()">
      <option class="subject" selected value="" translate>Grades</option>
      <option class="subject" *ngFor="let item of grades" ngValue="{{ item._id }}">{{ item.name }}</option>
    </select>
  `
})
export class TutorGradeComponent {
  @Input() grades: IGrade[] = [];
  @Output() afterChange = new EventEmitter();
  public searchFields: any = {
    grade: ''
  };
  // public gradesTutor: any = [
  //   {
  //     nameGrade: 'High School',
  //     key: '12',
  //     name: 'Grade 12'
  //   },
  //   {
  //     nameGrade: 'High School',
  //     key: '11',
  //     name: 'Grade 11'
  //   },
  //   {
  //     nameGrade: 'High School',
  //     key: '10',
  //     name: 'Grade 10'
  //   },
  //   {
  //     nameGrade: 'High School',
  //     key: '9',
  //     name: 'Grade 9'
  //   },
  //   {
  //     nameGrade: 'Middle School',
  //     key: '8',
  //     name: 'Grade 8'
  //   },
  //   {
  //     nameGrade: 'Middle School',
  //     key: '7',
  //     name: 'Grade 7'
  //   },
  //   {
  //     nameGrade: 'Middle School',
  //     key: '6',
  //     name: 'Grade 6'
  //   },
  //   {
  //     nameGrade: 'Elementary',
  //     key: '5',
  //     name: 'Grade 5'
  //   },
  //   {
  //     nameGrade: 'Elementary',
  //     key: '4',
  //     name: 'Grade 4'
  //   },
  //   {
  //     nameGrade: 'Elementary',
  //     key: '3',
  //     name: 'Grade 3'
  //   },
  //   {
  //     nameGrade: 'Elementary',
  //     key: '2',
  //     name: 'Grade 2'
  //   },
  //   {
  //     nameGrade: 'Elementary',
  //     key: '1',
  //     name: 'Grade 1'
  //   },
  //   {
  //     nameGrade: 'Elementary',
  //     key: 'kindergarten',
  //     name: 'Kindergarten'
  //   },
  //   {
  //     nameGrade: 'College',
  //     key: 'freshman',
  //     name: 'Freshman'
  //   },
  //   {
  //     nameGrade: 'College',
  //     key: 'sophomore',
  //     name: 'Sophomore'
  //   },
  //   {
  //     nameGrade: 'College',
  //     key: 'junior',
  //     name: 'Junior'
  //   },
  //   {
  //     nameGrade: 'College',
  //     key: 'senior',
  //     name: 'Senior'
  //   },
  // ];
  constructor(private router: Router) {}

  gradeChange() {
    this.afterChange.emit(this.searchFields);
  }
}
