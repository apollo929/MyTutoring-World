import { Component, OnInit } from '@angular/core';
import { GradeService } from '../grade.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: './create.html'
})
export class GradeCreateComponent implements OnInit {
  public grade: any = {
    name: '',
    alias: '',
    description: '',
    ordering: 0,
    type: 'elementary'
  };
  public isSubmitted: Boolean = false;

  constructor(private router: Router, private gradeService: GradeService, private toasty: ToastrService) {}

  ngOnInit() {}

  submit(frm: any) {
    if (!frm.valid) {
      return this.toasty.error('Invalid form, please try again.');
    }
    this.isSubmitted = true;
    this.gradeService.create(this.grade).then(
      () => {
        this.toasty.success('Grade has been created');
        this.router.navigate(['/grades/list']);
      },
      err => this.toasty.error(err.data.message || 'Something went wrong!')
    );
  }
}
