import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { LectureSectionService } from 'app/shared/services/lecture-section.service';
import { ICourseSection } from 'app/course/interface';

@Component({
    selector: 'modal-lecture-section',
    templateUrl: './modal-lecture-section.html'
})
export class ModalLectureSection implements OnInit, OnChanges {

    @Input() course;
    @Input() tutor;
    @Input() section: ICourseSection = new ICourseSection();

    isEdit = false;


    constructor(public activeModal: NgbActiveModal, private translate: TranslateService, private toasty: ToastrService, private api: LectureSectionService) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(this.section)
        if (this.section.title) {
            this.isEdit = true;
        } else {
            this.section = new ICourseSection();
        }
    }

    submit(frm: any) {
        let d: any = frm.value;
        d.courseId = this.course._id
        d.tutorId = this.tutor._id

        if (!frm.valid) {
            return this.toasty.error(this.translate.instant('Please complete the required fields!'));
        }

        if (this.section._id) {
            this.api.update(this.section._id, d).then(res => {
                this.activeModal.close(true)
            }).catch(e => {
                this.toasty.error(this.translate.instant('Something went wrong, please try again!'));
            });
        } else {
            this.api.create(d).then(res => {
                this.activeModal.close(true)
            }).catch(e => {
                this.toasty.error(this.translate.instant('Something went wrong, please try again!'));
            });
        }




    }

}
