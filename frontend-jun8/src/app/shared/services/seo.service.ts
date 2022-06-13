import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private seoChanged = new Subject<any>();
  public seoChanged$ = this.seoChanged.asObservable();

  constructor() { }

  update(title: string, meta?: any) {
    this.seoChanged.next({
      title,
      meta
    });
  }
}
