import { Component, OnInit } from '@angular/core';
import { ROUTES } from './menu-items';
import { Router } from '@angular/router';
import { AuthService } from '../services';

declare var $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  showMenu: any = '';
  showSubMenu: any = '';
  showSubSubMenu: any = '';
  public isShowMenu: any = false;
  public sidebarnavItems: any[];
  public windowWidth: number;
  public dropdownItem: any;
  // this is for the open close
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }
  constructor(private router: Router, private authService: AuthService) {}
  // End open close
  ngOnInit() {
    this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);
    $(function () {
      this.windowWidth = $(window).width();
      $(window).resize(function () {
        this.windowWidth = $(window).width();
        if (this.windowWidth >= 767) {
          $('#sidebarnav li').on('mouseover', function () {
            const $menuItem = $(this),
              $submenuWrapper = $('> ul.collapse', $menuItem);

            // grab the menu item's position relative to its positioned parent
            const menuItemPos = $menuItem.position();

            // place the submenu in the correct position relevant to the menu item
            $submenuWrapper.css({
              top: menuItemPos.top + 60,
              left: menuItemPos.left
            });
          });
        }
      });
      if (this.windowWidth >= 767) {
        $('#sidebarnav li').on('mouseover', function () {
          const $menuItem = $(this),
            $submenuWrapper = $('> ul.collapse', $menuItem);

          // grab the menu item's position relative to its positioned parent
          const menuItemPos = $menuItem.position();

          // place the submenu in the correct position relevant to the menu item
          $submenuWrapper.css({
            top: menuItemPos.top + 60,
            left: menuItemPos.left
          });
        });
      }
      $('.sidebartoggler').on('click', function () {
        if ($('#main-wrapper').hasClass('mini-sidebar')) {
          $('body').trigger('resize');
          $('#main-wrapper').removeClass('mini-sidebar');
        } else {
          $('body').trigger('resize');
          $('#main-wrapper').addClass('mini-sidebar');
        }
      });

      $('.sidebar-nav .scroll-top-bar li ul li a').on('click', function () {
        if ($('#sidebarnav').hasClass('show')) {
          $('#sidebarnav').removeClass('show');
        }
      });
    });
  }

  logout() {
    this.authService.removeToken();
    this.router.navigate(['/auth/login']);
  }

  showDropdown(item) {
    this.isShowMenu = !this.isShowMenu;
    this.dropdownItem = item;
  }
}
