import { SeoService } from './../../../shared/services/seo.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../shared/services';
import { filter } from 'rxjs/operators';

@Component({
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  public type: any = '';

  constructor(private router: Router, private authService: AuthService, private seoService: SeoService) {
    seoService.update('Dashboard');
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras && navigation.extras.state && navigation.extras.state.current) {
        this.type = navigation.extras.state.current.type;
      }
    });
  }

  ngOnInit() {
    if (!this.type) {
      this.authService.getCurrentUser().then(resp => {
        this.type = resp.type;
      });
    }
  }
}
