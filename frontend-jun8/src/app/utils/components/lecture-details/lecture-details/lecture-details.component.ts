import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SeoService, AuthService, CouponService } from '../../../../shared/services';
import { IUser } from '../../../../user/interface';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { ICourse, ICourseLecture, ICourseSection } from 'app/course/interface';
import { GoalService } from 'app/shared/services/goal.service';
import { LectureSectionService } from 'app/shared/services/lecture-section.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalLectureSection } from 'app/user/component/course/modal-lecture-section/modal-lecture-section';
import { ModalLecture } from 'app/user/component/course/modal-lecture/modal-lecture';
import { LectureService } from 'app/shared/services/lecture.service';
@Component({
  selector: 'app-lecture-details',
  templateUrl: './lecture-details.html'
})
export class LectureDetailsComponent implements OnInit {
  @Input() tutor: IUser;
  @Input() course: ICourse;
  sections: ICourseSection[];
  section = new ICourseSection()

  lectures: ICourseLecture[];

  able_to = "";
  age = "";
  pre = "";

  public isSubmitted: Boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toasty: ToastrService,
    private authService: AuthService,
    private lectureSectionService: LectureSectionService,
    private lectureService: LectureService,
    private translate: TranslateService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    if (this.tutor && this.tutor._id) {
      this.section.tutorId = this.tutor._id;
    }
    if (this.course && this.course._id) {
      this.section.courseId = this.course._id;
    }
    this.getCurrentgoal()
    this.getCurrentLectures()
  }

  getCurrentgoal() {
    this.lectureSectionService
      .getCurrentSections({
        courseId: this.section.courseId || '',
        tutorId: this.section.tutorId || ''
      })
      .then(resp => {
        if (resp && resp.data) {
          let d: [] = resp.data;
          this.sections = d.sort((a: any, b: any) => a.ordering - b.ordering)
        }
      });
  }

  getCurrentLectures() {
    this.lectureService.getCurrentSections({
      courseId: this.section.courseId || '',
      tutorId: this.section.tutorId || ''
    }).then(resp => {
      if (resp && resp.data) {
        let d: [] = resp.data;
        this.lectures = d.sort((a: any, b: any) => a.ordering - b.ordering)
      }
    });
  }



  delete(id) {
    if (confirm("Are you sure to delete the section?")) {
      this.lectureSectionService.delete(id).then(resp => {
        this.toasty.success(this.translate.instant('Deleted Successfully'));
        this.getCurrentgoal();
      }, err => this.toasty.error(this.translate.instant(err.data.message || 'Something went wrong!')))
    }
  }

  deleteLecture(id) {
    if (confirm("Are you sure to delete the lecture?")) {
      this.lectureService.delete(id).then(resp => {
        this.toasty.success(this.translate.instant('Deleted Successfully'));
        this.getCurrentLectures();
      }, err => this.toasty.error(this.translate.instant(err.data.message || 'Something went wrong!')))
    }
  }

  addLectureSection() {
    const modalRef = this.modalService.open(ModalLectureSection, { centered: true, size: 'lg', backdrop: 'static' })
    modalRef.result.then(status => {
      if (status) {
        this.getCurrentgoal();
      }
    });
    modalRef.componentInstance.tutor = this.tutor;
    modalRef.componentInstance.course = this.course;
  }

  addLecture(section) {
    const modalRef = this.modalService.open(ModalLecture, { centered: true, size: 'lg', backdrop: 'static' })
    modalRef.result.then(status => {
      if (status) {
        this.getCurrentLectures()
      }
    });
    modalRef.componentInstance.tutor = this.tutor;
    modalRef.componentInstance.course = this.course;
    modalRef.componentInstance.section = section;
  }

  editLectureSection(section) {
    const modalRef = this.modalService.open(ModalLectureSection, { centered: true, size: 'lg', backdrop: 'static' })
    modalRef.result.then(status => {
      if (status) {
        this.getCurrentgoal();
      }
    });
    modalRef.componentInstance.tutor = this.tutor;
    modalRef.componentInstance.course = this.course;
    modalRef.componentInstance.section = section;
  }

  editLecture(section, lec) {
    const modalRef = this.modalService.open(ModalLecture, { centered: true, size: 'lg', backdrop: 'static' })
    modalRef.result.then(status => {
      if (status) {
        this.getCurrentLectures();
      }
    });
    modalRef.componentInstance.tutor = this.tutor;
    modalRef.componentInstance.course = this.course;
    modalRef.componentInstance.section = section;
    modalRef.componentInstance.lecture = lec;
  }

  getTotalLectures(id) {
    let c = 0;
    if (this.lectures) {
      this.lectures.forEach(l => {
        if (l.sectionId == id) {
          c++;
        }
      })
    }
    return c;
  }

}
