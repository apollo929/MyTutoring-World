import { Component, Input, OnDestroy, Inject, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { UtilService } from './services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spinner',
  template: `<div class="preloader" *ngIf="isSpinnerVisible">
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
  </div>`,
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnDestroy {
  public isSpinnerVisible = true;
  private loadingSubscription: Subscription;

  @Input() public backgroundColor = 'rgba(0, 115, 170, 0.69)';

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document, private utilService: UtilService) {
    this.router.events.subscribe(
      event => {
        if (event instanceof NavigationStart) {
          this.isSpinnerVisible = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          if (this.router.url.indexOf('#webinar') === -1 && this.router.url.indexOf('#review') === -1) {
            $('html, body').animate({ scrollTop: 0 });
          }
          this.isSpinnerVisible = false;
        }
      },
      () => {
        this.isSpinnerVisible = false;
      }
    );

    this.loadingSubscription = utilService.appLoading$.subscribe(loading => (this.isSpinnerVisible = loading));
  }

  ngOnDestroy(): void {
    this.isSpinnerVisible = false;
    this.loadingSubscription.unsubscribe();
  }
}
