import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class UtilService {
  private appLoading = new Subject<any>();
  public appLoading$ = this.appLoading.asObservable();

  private eventChange = new Subject<any>();
  public eventChanged$ = this.eventChange.asObservable();

  constructor() { }

  setLoading(loading: boolean) {
    this.appLoading.next(loading);
  }

  notifyEvent(name: String, value: any) {
    this.eventChange.next({
      name,
      value
    });
  }
}
