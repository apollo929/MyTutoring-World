import { ActivatedRoute } from '@angular/router';
import { IStats } from './interface';
import { starterService } from './starter.service';
import { Component, AfterViewInit } from '@angular/core';

@Component({
  templateUrl: './starter.component.html'
})
export class StarterComponent implements AfterViewInit {
  subtitle: String;
  public stats: IStats;
  public config: any;

  constructor(private staterSerive: starterService, private route: ActivatedRoute) {
    this.subtitle = 'Quick analytics';
    this.config = this.route.snapshot.data['appConfig'];
  }
  ngOnInit() {
    this.staterSerive
      .stats()
      .then(resp => {
        this.stats = resp.data;
      })
      .catch(() => alert('Something went wrong, please try again!'));
  }
  ngAfterViewInit() {}
}
