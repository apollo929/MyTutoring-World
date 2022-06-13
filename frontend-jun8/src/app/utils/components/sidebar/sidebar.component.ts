import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from '../../../shared/services';

declare var $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  public tree: any = [];

  constructor(private router: Router, private route: ActivatedRoute,
    private authService: AuthService) {
  }
  // End open close
  ngOnInit() {
  }

  logout() {
    this.authService.removeToken();
    this.router.navigate(['/']);
  }
}
