import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/services';

@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.html'
})
export class ProfileCardCustomComponent implements OnInit {
  @Input() user: any;
  @Output() afterUpload = new EventEmitter();
  avatarOptions: any = {};
  public maxFileSize: number;
  public userId: any;
  public urlAvatar: any;
  public currentUser: any;
  constructor(private route: ActivatedRoute, private authService: AuthService) {
    this.maxFileSize = window.appConfig.maximumFileSize;
    if (this.authService.isLoggedin()) {
      this.authService.getCurrentUser().then(resp => {
        this.currentUser = resp;
      });
    }
  }

  ngOnInit() {
    this.userId = this.user && this.user._id ? this.user._id : null;
    if (this.userId) {
      this.urlAvatar = window.appConfig.apiBaseUrl + '/users/' + this.userId + '/avatar';
    }
    if (!this.userId) {
      this.urlAvatar = window.appConfig.apiBaseUrl + '/admin/upload-avatar';
    }

    this.avatarOptions = {
      url: this.urlAvatar,
      fileFieldName: 'avatar',
      onFinish: resp => {
        this.user.avatarUrl = resp.data.url;
        this.afterUpload.emit(resp.data.avatar);
      }
    };
  }
}
