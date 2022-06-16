import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';

export const AuthRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'login',
      component: LoginComponent
    }, {
      path: 'forgot',
      component: ForgotComponent
    }]
  }
];
