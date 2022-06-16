import { Component, OnInit } from '@angular/core';
import { GradeService } from '../grade.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
  selector: 'app-grade-update',
  templateUrl: './update.html'
})
export class GradeUpdateComponent implements OnInit {
  public info: any = {};
  public isSubmitted: Boolean = false;
  private gradeId: String;

  constructor(
    private router: Router,
    private gradeService: GradeService,
    private toasty: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.gradeId = this.route.snapshot.paramMap.get('id');

    this.gradeService.findOne(this.gradeId).then(resp => {
      this.info = _.pick(resp.data, ['name', 'alias', 'description', 'ordering', 'type']);
    });
  }

  submit(frm: any) {
    this.isSubmitted = true;
    this.gradeService
      .update(this.gradeId, this.info)
      .then(resp => {
        this.toasty.success('Updated successfuly!');
        this.router.navigate(['/grades/list']);
      })
      .catch(err => this.toasty.error(err.data.data.message || err.data.data.email));
  }
}
