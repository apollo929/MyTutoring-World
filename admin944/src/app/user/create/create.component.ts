import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-create',
  templateUrl: '../form.html'
})
export class UserCreateComponent implements OnInit {
  public info: any = {
    type: 'student',
    username: '',
    password: '',
    name: '',
    email: '',
    address: '',
    role: 'user',
    emailVerified: true,
    isActive: true,
    avatarUrl: '',
    avatar: ''
  };
  public isSubmitted: boolean = false;
  public loading: boolean = false;

  constructor(private router: Router, private userService: UserService, private toasty: ToastrService) {}

  ngOnInit() {}

  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid) {
      return this.toasty.error('Something went wrong, please check and try again!');
    }

    const data = _.pick(this.info, [
      'name',
      'subjectIds',
      'email',
      'role',
      'isActive',
      'emailVerified',
      'address',
      'emailNotification',
      'phoneVerified',
      'type',
      'password',
      'avatar'
    ]);

    this.userService
      .create(data)
      .then(resp => {
        this.toasty.success('Created successfully!');
        this.router.navigate(['/users/update/' + resp.data._id]);
      })
      .catch(err => this.toasty.error(err.data.data.message || err.data.data.email));
  }

  afterUpload(evt) {
    if (!this.info._id) {
      this.info.avatar = evt;
    }
  }
}
