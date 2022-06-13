import { QuillModule } from 'ngx-quill';
import { ConfigResolver } from './../shared/resolver/config.resolver';
import { SeoService } from './../shared/services/seo.service';
import { SystemService } from './../shared/services/system.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MediaModule } from '../media/media.module';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotComponent } from './forgot/forgot.component';
import { AuthRoutingModule } from './auth.routing';
import { UtilsModule } from '../utils/utils.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    JsonpModule,
    NgbModule,
    MediaModule,
    UtilsModule,
    NgSelectModule,
    TranslateModule.forChild(),
    QuillModule.forRoot()
  ],
  declarations: [LoginComponent, SignupComponent, ForgotComponent],
  providers: [ConfigResolver]
})
export class AuthModule {}
