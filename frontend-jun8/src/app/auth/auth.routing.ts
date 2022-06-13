import { ConfigResolver } from './../shared/resolver/config.resolver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotComponent } from './forgot/forgot.component';
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    resolve: {
      appConfig: ConfigResolver
    }
  },
  {
    path: 'sign-up',
    component: SignupComponent,
    resolve: {
      appConfig: ConfigResolver
    }
  },
  {
    path: 'forgot',
    component: ForgotComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
