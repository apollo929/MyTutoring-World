import { Component, Input } from '@angular/core';
import { IGrade } from '../../interface';
import * as _ from 'lodash';
@Component({
  selector: 'grade-tutor',
  template: `
    <ng-select
      [items]="gradesTutor"
      appendTo="body"
      bindLabel="name"
      groupBy="nameGrade"
      [selectableGroup]="false"
      [multiple]="true"
      [closeOnSelect]="false"
      [(ngModel)]="tutor.grades"
      placeholder="{{ 'Choose grades' | translate }}"
      bindValue="key"
      name="grade"
      #grades="ngModel"
      required
    >
    </ng-select>
    <div *ngIf="grades.errors && (grades.dirty || grades.touched || isSubmitted)">
      <p [hidden]="!grades.errors.required" style="color:red">Please choose grades!</p>
    </div>
  `
})
export class TutorGradeComponent {
  @Input() tutor: any;
  @Input() isSubmitted: boolean;
  public gradesTutor: IGrade[] = [
    {
      nameGrade: 'High School',
      key: '12',
      name: 'Grade 12'
    },
    {
      nameGrade: 'High School',
      key: '11',
      name: 'Grade 11'
    },
    {
      nameGrade: 'High School',
      key: '10',
      name: 'Grade 10'
    },
    {
      nameGrade: 'High School',
      key: '9',
      name: 'Grade 9'
    },
    {
      nameGrade: 'Middle School',
      key: '8',
      name: 'Grade 8'
    },
    {
      nameGrade: 'Middle School',
      key: '7',
      name: 'Grade 7'
    },
    {
      nameGrade: 'Middle School',
      key: '6',
      name: 'Grade 6'
    },
    {
      nameGrade: 'Elementary',
      key: '5',
      name: 'Grade 5'
    },
    {
      nameGrade: 'Elementary',
      key: '4',
      name: 'Grade 4'
    },
    {
      nameGrade: 'Elementary',
      key: '3',
      name: 'Grade 3'
    },
    {
      nameGrade: 'Elementary',
      key: '2',
      name: 'Grade 2'
    },
    {
      nameGrade: 'Elementary',
      key: '1',
      name: 'Grade 1'
    },
    {
      nameGrade: 'Elementary',
      key: 'kindergarten',
      name: 'Kindergarten'
    },
    {
      nameGrade: 'College',
      key: 'freshman',
      name: 'Freshman'
    },
    {
      nameGrade: 'College',
      key: 'sophomore',
      name: 'Sophomore'
    },
    {
      nameGrade: 'College',
      key: 'junior',
      name: 'Junior'
    },
    {
      nameGrade: 'College',
      key: 'senior',
      name: 'Senior'
    }
  ];
  constructor() {}
}
