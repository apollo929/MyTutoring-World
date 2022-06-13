import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SeoService, AuthService, CouponService } from '../../../../shared/services';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-apply-coupon',
  templateUrl: './apply.html'
})
export class ApplyCouponComponent implements OnInit {
  @Input() options: any = {
    couponId: '',
    webinarId: '',
    tutorId: '',
    courseId: '',
    targetType: '',
    topicId: ''
  };
  @Output() onApply = new EventEmitter();
  @Output() isUsed = new EventEmitter();
  public usedCoupon: boolean = false;
  public couponCode: string = '';
  public appliedCoupon: boolean = false;
  constructor(
    private couponService: CouponService,
    private translate: TranslateService,
    private toasty: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.options.couponId) {
      this.checkUsedCoupon(this.options.couponId);
    }
  }

  checkUsedCoupon(params: any) {
    this.couponService.checkUsedCoupon(params).then(resp => {
      this.usedCoupon = resp.data.used;
      this.isUsed.emit(this.usedCoupon);
    });
  }

  applyCoupon() {
    if (!this.authService.isLoggedin()) {
      this.onApply.emit({ appliedCoupon: this.appliedCoupon, code: this.couponCode });
      return this.toasty.error(this.translate.instant('Please login to use the coupon!'));
    }
    if (!this.options.topicId && this.options.targetType === 'subject') {
      return this.toasty.error(this.translate.instant('Please choose category, subject and topic first!'));
    }
    if (this.appliedCoupon) {
      this.appliedCoupon = !this.appliedCoupon;
      return this.onApply.emit({ appliedCoupon: this.appliedCoupon, code: this.couponCode });
    }
    if (!this.couponCode) {
      this.onApply.emit({ appliedCoupon: this.appliedCoupon, code: this.couponCode });
      return this.toasty.error(this.translate.instant('Please enter coupon code!'));
    }
    if (this.options.couponId && !this.appliedCoupon) {
      this.couponService
        .applyCoupon({
          code: this.couponCode || '',
          targetType: this.options.targetType,
          webinarId: this.options.webinarId || '',
          tutorId: this.options.tutorId || '',
          courseId: this.options.courseId || ''
        })
        .then(resp => {
          if (resp.data && resp.data.canApply) {
            this.appliedCoupon = true;
            this.onApply.emit({ appliedCoupon: this.appliedCoupon, code: this.couponCode });
            return this.toasty.success(this.translate.instant('Applied coupon'));
          }
          this.onApply.emit({ appliedCoupon: this.appliedCoupon, code: this.couponCode });
          this.toasty.error(this.translate.instant('Coupon code not available!'));
        })
        .catch(err => {
          this.onApply.emit({ appliedCoupon: this.appliedCoupon, code: this.couponCode });
          this.toasty.error(this.translate.instant('Coupon code not available!'));
        });
    } else {
      this.appliedCoupon = false;
      this.onApply.emit({ appliedCoupon: this.appliedCoupon, code: this.couponCode });
    }
  }
}
