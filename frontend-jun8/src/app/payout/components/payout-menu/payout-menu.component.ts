import { Component, Input } from '@angular/core';
import { AuthService } from '../../../shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'payout-menu',
  templateUrl: './payout-menu.html'
})
export class PayoutMenuComponent {
  constructor(private router: Router, private authService: AuthService) {
  }
}
