import { Component, Input, AfterContentInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../../shared/services';
import { Router } from '@angular/router';
import { IUser } from '../../../user/interface';
declare var jQuery: any;

@Component({
  selector: 'user-left-menu',
  templateUrl: './left-menu.html'
})
export class UserLeftMenuComponent implements AfterViewInit {
  public type: any = '';
  public currentUser: IUser;
  constructor(private router: Router, private authService: AuthService) {
    this.authService.getCurrentUser().then(resp => {
      this.type = resp.type;
      this.currentUser = resp;
    });
  }

  ngAfterViewInit() {
    (function ($) {
      $(document).ready(function () {
        // header bottom slider

        const SETTINGS = {
          navBarTravelling: false,
          navBarTravelDirection: '',
          navBarTravelDistance: 150
        };

        const colours = {
          0: '#e3455a'
        };

        document.documentElement.classList.remove('no-js');
        document.documentElement.classList.add('js');

        // Out advancer buttons
        const pnAdvancerLeft = document.getElementById('pnAdvancerLeft');
        const pnAdvancerRight = document.getElementById('pnAdvancerRight');
        // the indicator
        const pnIndicator = document.getElementById('pnIndicator');

        const pnProductNav = document.getElementById('pnProductNav');
        const pnProductNavContents = document.getElementById('pnProductNavContents');

        pnProductNav.setAttribute('data-overflowing', determineOverflow(pnProductNavContents, pnProductNav));

        // Set the indicator
        // moveIndicator(pnProductNav.querySelector('[aria-selected="true"]'), colours[0]);

        // Handle the scroll of the horizontal container
        let last_known_scroll_position = 0;
        let ticking = false;

        function doSomething(scroll_pos) {
          pnProductNav.setAttribute('data-overflowing', determineOverflow(pnProductNavContents, pnProductNav));
        }

        pnProductNav.addEventListener('scroll', function () {
          last_known_scroll_position = window.scrollY;
          if (!ticking) {
            window.requestAnimationFrame(function () {
              doSomething(last_known_scroll_position);
              ticking = false;
            });
          }
          ticking = true;
        });

        pnAdvancerLeft.addEventListener('click', function () {
          // If in the middle of a move return
          if (SETTINGS.navBarTravelling === true) {
            return;
          }
          // If we have content overflowing both sides or on the left
          if (
            determineOverflow(pnProductNavContents, pnProductNav) === 'left' ||
            determineOverflow(pnProductNavContents, pnProductNav) === 'both'
          ) {
            // Find how far this panel has been scrolled
            const availableScrollLeft = pnProductNav.scrollLeft;
            // If the space available is less than two lots of our desired distance, just move the whole amount
            // otherwise, move by the amount in the settings
            if (availableScrollLeft < SETTINGS.navBarTravelDistance * 2) {
              pnProductNavContents.style.transform = 'translateX(' + availableScrollLeft + 'px)';
            } else {
              pnProductNavContents.style.transform = 'translateX(' + SETTINGS.navBarTravelDistance + 'px)';
            }
            // We do want a transition (this is set in CSS) when moving so remove the class that would prevent that
            pnProductNavContents.classList.remove('pn-ProductNav_Contents-no-transition');
            // Update our settings
            SETTINGS.navBarTravelDirection = 'left';
            SETTINGS.navBarTravelling = true;
          }
          // Now update the attribute in the DOM
          pnProductNav.setAttribute('data-overflowing', determineOverflow(pnProductNavContents, pnProductNav));
        });

        pnAdvancerRight.addEventListener('click', function () {
          // If in the middle of a move return
          if (SETTINGS.navBarTravelling === true) {
            return;
          }
          // If we have content overflowing both sides or on the right
          if (
            determineOverflow(pnProductNavContents, pnProductNav) === 'right' ||
            determineOverflow(pnProductNavContents, pnProductNav) === 'both'
          ) {
            // Get the right edge of the container and content
            const navBarRightEdge = pnProductNavContents.getBoundingClientRect().right;
            const navBarScrollerRightEdge = pnProductNav.getBoundingClientRect().right;
            // Now we know how much space we have available to scroll
            const availableScrollRight = Math.floor(navBarRightEdge - navBarScrollerRightEdge);
            // If the space available is less than two lots of our desired distance, just move the whole amount
            // otherwise, move by the amount in the settings
            if (availableScrollRight < SETTINGS.navBarTravelDistance * 2) {
              pnProductNavContents.style.transform = 'translateX(-' + availableScrollRight + 'px)';
            } else {
              pnProductNavContents.style.transform = 'translateX(-' + SETTINGS.navBarTravelDistance + 'px)';
            }
            // We do want a transition (this is set in CSS) when moving so remove the class that would prevent that
            pnProductNavContents.classList.remove('pn-ProductNav_Contents-no-transition');
            // Update our settings
            SETTINGS.navBarTravelDirection = 'right';
            SETTINGS.navBarTravelling = true;
          }
          // Now update the attribute in the DOM
          pnProductNav.setAttribute('data-overflowing', determineOverflow(pnProductNavContents, pnProductNav));
        });

        pnProductNavContents.addEventListener(
          'transitionend',
          function () {
            // get the value of the transform, apply that to the current scroll position (so get the scroll pos first) and then remove the transform
            const styleOfTransform = window.getComputedStyle(pnProductNavContents, null);
            const tr =
              styleOfTransform.getPropertyValue('-webkit-transform') || styleOfTransform.getPropertyValue('transform');
            // If there is no transition we want to default to 0 and not null
            const amount = Math.abs(parseInt(tr.split(',')[4]) || 0);
            pnProductNavContents.style.transform = 'none';
            pnProductNavContents.classList.add('pn-ProductNav_Contents-no-transition');
            // Now lets set the scroll position
            if (SETTINGS.navBarTravelDirection === 'left') {
              pnProductNav.scrollLeft = pnProductNav.scrollLeft - amount;
            } else {
              pnProductNav.scrollLeft = pnProductNav.scrollLeft + amount;
            }
            SETTINGS.navBarTravelling = false;
          },
          false
        );

        // Handle setting the currently active link
        // pnProductNavContents.addEventListener('click', function (e) {
        //   const links = [].slice.call(document.querySelectorAll('.pn-ProductNav_Link'));
        //   links.forEach(function (item) {
        //     item.setAttribute('aria-selected', 'false');
        //   });
        //   // e.target.setAttribute('aria-selected', 'true');
        //   // Pass the clicked item and it's colour to the move indicator function
        //   moveIndicator(e.target, colours[links.indexOf(e.target)]);
        // });

        // const count = 0;
        function moveIndicator(item, color) {
          const textPosition = item.getBoundingClientRect();
          const container = pnProductNavContents.getBoundingClientRect().left;
          const distance = textPosition.left - container;
          const scroll = pnProductNavContents.scrollLeft;
          pnIndicator.style.transform =
            'translateX(' + (distance + scroll) + 'px) scaleX(' + textPosition.width * 0.01 + ')';
          // count = count += 100;
          // pnIndicator.style.transform = "translateX(" + count + "px)";

          if (color) {
            pnIndicator.style.backgroundColor = color;
          }
        }
        function determineOverflow(content, container) {
          var containerMetrics = container.getBoundingClientRect();
          var containerMetricsRight = Math.floor(containerMetrics.right);
          var containerMetricsLeft = Math.floor(containerMetrics.left);
          var contentMetrics = content.getBoundingClientRect();
          var contentMetricsRight = Math.floor(contentMetrics.right);
          var contentMetricsLeft = Math.floor(contentMetrics.left);
          if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) {
            return 'both';
          } else if (contentMetricsLeft < containerMetricsLeft) {
            return 'left';
          } else if (contentMetricsRight > containerMetricsRight) {
            return 'right';
          } else {
            return 'none';
          }
        }
      });
    })(jQuery);
  }

  logout() {
    this.authService.removeToken();
    this.router.navigate(['/shop']);
  }
}
