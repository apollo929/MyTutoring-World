import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/services/auth.service';
import { Component, Input, AfterViewInit } from '@angular/core';
import { ICourse } from '../interface';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../course.service';
declare var jQuery: any;
@Component({
  selector: 'app-card-course',
  templateUrl: './card-course.html'
})
export class CardCourseComponent implements AfterViewInit {
  @Input() course: ICourse;
  public description: string;
  @Input() config: any;
  public latestSlot: any;
  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private toasty: ToastrService,
    private courseService: CourseService
  ) {
    this.config = this.route.snapshot.data['appConfig'];
  }

  // ngOnInit() {
  //   this.courseService
  //     .getLatest(this.course._id)
  //     .then(res => {
  //       if (res.data && res.data.latest) this.latestSlot = res.data.latest;
  //     })
  //     .catch(e => {
  //       this.toasty.error(this.translate.instant('new something went wrong!'));
  //     });
  // }

  ngAfterViewInit() {}
}
