import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { pick } from 'lodash';
@Component({
  selector: 'app-modal-create-category',
  templateUrl: './form.html'
})
export class MyCategoryFormComponent implements OnInit {
  @Input() categories: any[];
  @Input() myCategory: any = {
    isActive: true
  };

  public submitted: boolean = false;
  constructor(private toasty: ToastrService, public activeModal: NgbActiveModal) {}

  ngOnInit() {}

  submit(frm: any) {
    this.submitted = true;
    if (!frm.valid) {
      return this.toasty.error('Please complete the required fields!');
    }
    this.activeModal.close(pick(this.myCategory, ['originalCategoryId', 'isActive']));
  }
}
