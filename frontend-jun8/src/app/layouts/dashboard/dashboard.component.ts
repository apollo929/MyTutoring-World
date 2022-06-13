import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardLayoutComponent implements OnInit {
  constructor(public router: Router) { }

  ngOnInit() {
  }
}
