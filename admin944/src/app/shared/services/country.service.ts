import { Injectable } from '@angular/core';
import { countries } from '../data/countries';
@Injectable({
  providedIn: 'root'
})
export class CountryService {
  constructor() {}

  getCountry() {
    return countries;
  }
}
