import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-update',
  templateUrl: '../form.html'
})
export class UserUpdateComponent implements OnInit {
  public info: any = {};
  public avatarUrl = '';
  public isSubmitted = false;
  public avatarOptions: any = {};
  public user: any = {};
  private userId: String;
  public loading: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private toasty: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.userService
      .findOne(this.userId)
      .then(resp => {
        this.user = resp.data;
        this.info = _.pick(resp.data, [
          'name',
          'email',
          'isActive',
          'emailVerified',
          'address',
          'role',
          'emailNotification',
          'type',
          'phoneNumber',
          'avatarUrl',
          'createdAt'
        ]);
        this.avatarUrl = resp.data.avatarUrl;
        this.loading = false;
      })
      .catch(e => {
        this.loading = false;
        return this.toasty.error('Something went wrong, please try again!');
      });
  }

  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid) {
      return this.toasty.error('Something went wrong, please check and try again!');
    }
    const data = _.pick(this.info, [
      'name',
      'email',
      'role',
      'isActive',
      'emailVerified',
      'address',
      'emailNotification',
      'phoneVerified',
      'type',
      'password'
    ]);
    this.userService
      .update(this.userId, data)
      .then(resp => {
        this.toasty.success('Updated successfuly!');
        this.router.navigate(['/users/list']);
      })
      .catch(err => this.toasty.error(err.data.data.message || err.data.data.email));
  }
  afterUpload(evt) {
    if (!this.info._id) {
      this.info.avatar = evt;
    }
  }
}
