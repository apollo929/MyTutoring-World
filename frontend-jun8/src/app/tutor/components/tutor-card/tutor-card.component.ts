import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services';
import { FavoriteService, LanguageService } from '../../../shared/services';
import { IUser } from '../../../user/interface';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'tutor-card',
  templateUrl: './tutor-card.html'
})
export class TutorCardComponent implements OnInit {
  @Input() tutor: IUser;
  public isLoggedin: boolean;
  public currentUser: IUser = {};
  avatarOptions: any = {};

  ngOnInit() {
    if (this.authService.isLoggedin()) {
      this.currentUser = this.authService.getCurrentUser();
      this.isLoggedin = true;
    }
  }
  constructor(
    private authService: AuthService,
    private tutorFavoriteService: FavoriteService,
    private toastService: ToastrService,
    public languageService: LanguageService,
    public router: Router,
    private translate: TranslateService
  ) {}

  favorite() {
    if (!this.isLoggedin) this.toastService.error(this.translate.instant('Please loggin to use this feature!'));
    else {
      let params = Object.assign(
        {
          tutorId: this.tutor._id,
          type: 'tutor'
        },
        {}
      );
      this.tutorFavoriteService
        .favorite(params, 'tutor')
        .then(res => {
          this.tutor.isFavorite = true;
          this.toastService.success(this.translate.instant('Added to your favorite tutor list successfully!'));
        })
        .catch(() => this.toastService.error(this.translate.instant('Something went wrong, please try again!')));
    }
  }

  unFavorite() {
    if (!this.isLoggedin) this.toastService.error(this.translate.instant('Please loggin to use this feature!'));
    else {
      this.tutorFavoriteService
        .unFavorite(this.tutor._id, 'tutor')
        .then(res => {
          this.tutor.isFavorite = false;
          this.toastService.success(this.translate.instant('Deleted from your favorite tutor list successfully!'));
        })
        .catch(() => this.toastService.error(this.translate.instant('Something went wrong, please try again!')));
    }
  }

  bookFree() {
    const queryParams = {
      isFree: true
    };
    this.router.navigate(['/appointments', this.tutor.username], {
      queryParams: queryParams
    });
  }
}
