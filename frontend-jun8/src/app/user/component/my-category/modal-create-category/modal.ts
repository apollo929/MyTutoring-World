import { IMyCategory } from './../../../interface';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { pick } from 'lodash';
import { ICategory } from '../../../../categories/interface';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-modal-create-category',
  templateUrl: './form.html'
})
export class MyCategoryFormComponent implements OnInit {
  @Input() categories: ICategory[];
  @Input() myCategory: IMyCategory = {
    isActive: true
  };

  public submitted: boolean = false;
  constructor(private toasty: ToastrService, public activeModal: NgbActiveModal, private translate: TranslateService) {}

  ngOnInit() {}

  submit(frm: any) {
    this.submitted = true;
    if (!frm.valid) {
      return this.toasty.error(this.translate.instant('Please complete the required fields!'));
    }
    this.activeModal.close(pick(this.myCategory, ['originalCategoryId', 'isActive']));
  }
}
