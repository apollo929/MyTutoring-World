import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'star-rating',
  templateUrl: './star-rating.html',
  styleUrls: ['./star-rating.scss']
})
export class StarRatingComponent implements OnInit {

  @Input() rate: any;
  @Input() total: any;
  constructor() { }

  ngOnInit() {
  }
}
