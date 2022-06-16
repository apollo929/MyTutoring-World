import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from './shared/services';
import { Subscription } from 'rxjs/Subscription';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) {
    this.router.events.subscribe((event: any) => {
	    if (event instanceof NavigationEnd) {
        $('html, body').animate({ scrollTop: 0 });
	    }
	  });
  }

  ngOnInit() {
    if (this.authService.getAccessToken()) {
      this.authService.getCurrentUser();
    }
  }
}
