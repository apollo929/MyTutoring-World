import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthRoutes } from './auth.routing';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthRoutes),
    FormsModule,
    ReactiveFormsModule,
    JsonpModule,
    NgbModule
  ],
  declarations: [
    LoginComponent,
    ForgotComponent
  ]
})

export class AuthModule { }
