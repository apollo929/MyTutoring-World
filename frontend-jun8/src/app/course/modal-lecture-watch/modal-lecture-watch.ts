import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { LectureSectionService } from 'app/shared/services/lecture-section.service';
import { ICourseSection, ICourseLecture } from 'app/course/interface';
import { LectureService } from 'app/shared/services/lecture.service';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { CourseService } from '../course.service';

@Component({
    selector: 'modal-lecture-watch',
    templateUrl: './modal-lecture-watch.html'
})
export class ModalLectureWatch implements OnInit, OnChanges {

    @Input() type;
    @Input() url;

    loaded = false;
    value = null;

    constructor(private courseService: CourseService, public activeModal: NgbActiveModal, private translate: TranslateService, private toasty: ToastrService) { }

    ngOnInit() {
        let i = setInterval(() => {
            if (this.url) {
                this.loaded = true;
                this.value = this.url
            }
            if (this.loaded) {
                clearInterval(i)
            }
        }, 500);
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

}
