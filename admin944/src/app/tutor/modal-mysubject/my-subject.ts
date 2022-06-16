import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { pick } from 'lodash';
import { SubjectService } from '../../subject/subject.service';
@Component({
  selector: 'my-subject-form',
  templateUrl: './my-subject.html'
})
export class MySubjectFormComponent implements OnInit {
  @Input() subjects: any[];
  @Input() mySubject: any;
  @Input() selectedCategory: any;
  public submitted: boolean = false;
  constructor(
    private toasty: ToastrService,
    public activeModal: NgbActiveModal,
    private subjectService: SubjectService
  ) {}

  ngOnInit() {
    if (this.selectedCategory) {
      this.querySubjects();
    }
  }

  submit(frm: any) {
    this.submitted = true;
    if (!frm.valid) {
      return this.toasty.error('Please complete the required fields!');
    }
    this.activeModal.close(pick(this.mySubject, ['isActive', 'originalSubjectId']));
  }

  querySubjects() {
    this.subjectService.search({ categoryIds: this.selectedCategory.originalCategoryId, take: 1000 }).then(resp => {
      if (resp.data && resp.data.items && resp.data.items.length > 0) {
        this.subjects = resp.data.items;
      }
    });
  }
}
