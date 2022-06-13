import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SeoService, AuthService, CouponService } from '../../../../shared/services';
import { IUser } from '../../../../user/interface';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { ICourse, ICourseGoal } from 'app/course/interface';
import { GoalService } from 'app/shared/services/goal.service';
@Component({
  selector: 'app-course-goal',
  templateUrl: './course-goal-form.html'
})
export class CourseGoalComponent implements OnInit {
  @Input() tutor: IUser;
  @Input() course: ICourse;
  goals: ICourseGoal[];
  goal = new ICourseGoal()

  able_to = "";
  age = "";
  pre = "";

  public isSubmitted: Boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toasty: ToastrService,
    private authService: AuthService,
    private goalService: GoalService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    if (this.tutor && this.tutor._id) {
      this.goal.tutorId = this.tutor._id;
    }
    if (this.course && this.course._id) {
      this.goal.courseId = this.course._id;
    }
    this.getCurrentgoal()
  }

  getCurrentgoal() {
    this.goalService
      .getCurrentCoupon({
        courseId: this.goal.courseId || '',
        tutorId: this.goal.tutorId || ''
      })
      .then(resp => {
        if (resp && resp.data) {
          this.goals = resp.data;
        }
      });
  }

  add(type) {
    let data = JSON.parse(JSON.stringify(this.goal))
    data.type = type

    switch (type) {
      case 'able_to':
        data.name = this.able_to
        break;
      case 'pre':
        data.name = this.pre
        break;
      case 'age':
        data.name = this.age
        break;

      default:
        break;
    }

    this.goalService.create(data).then(
      resp => {
        this.getCurrentgoal()
        this[type] = ''
        this.toasty.success(this.translate.instant('Added successfully'));
      },
      err => this.toasty.error(this.translate.instant(err.data.message || 'Something went wrong!'))
    );
  }

  delete(id) {
    console.log(id)
    if (confirm("Are you sure to delete the goal?")) {
      this.goalService.delete(id).then(resp => {
        this.toasty.success(this.translate.instant('Deleted Successfully'));
        this.getCurrentgoal();
      }, err => this.toasty.error(this.translate.instant(err.data.message || 'Something went wrong!')))
    }
  }

  submit(frm) {
    this.isSubmitted = true;
    if (!frm.valid) {
      return this.toasty.error(this.translate.instant('Invalid form, please try again.'));
    }
    if (!this.goal._id) {
      this.goalService.create(this.goal).then(
        resp => {
          this.goal = resp.data;
          this.toasty.success(this.translate.instant('Goal has been created'));
        },
        err => this.toasty.error(this.translate.instant(err.data.message || 'Something went wrong!'))
      );
    } else {
      const data = _.pick(this.goal, [
        'name',
        'type',
        'tutorId',
        'courseId',
      ]);
      this.goalService.update(this.goal._id, data).then(
        () => {
          this.toasty.success(this.translate.instant('Goal has been updated'));
        },
        err => this.toasty.error(this.translate.instant(err.data.message || 'Something went wrong!'))
      );
    }
  }
}
