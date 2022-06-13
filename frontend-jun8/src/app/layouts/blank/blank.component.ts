import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'blank-layout',
  templateUrl: './blank.html'
})
export class BlankComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {

  }
}
