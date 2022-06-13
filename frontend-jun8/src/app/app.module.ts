import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { RestangularModule } from 'ngx-restangular';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxStripeModule } from 'ngx-stripe';

import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { DashboardLayoutComponent } from './layouts/dashboard/dashboard.component';

import { AuthService, CategoryService, StripeServiceAccount } from './shared/services';
import { AuthGuard } from './shared/guard/auth.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';

import { ConfigResolver, LanguageResolver, CategoryResolver } from './shared/resolver';
import { UtilsModule } from './utils/utils.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Function for setting the default restangular configuration
export function RestangularConfigFactory(RestangularProvider) {
  // TODO - change default config
  RestangularProvider.setBaseUrl(window.appConfig.apiBaseUrl);
  RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params) => {
    // Auto add token to header
    headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    return {
      headers: headers
    };
  });

  RestangularProvider.addErrorInterceptor((response, subject, responseHandler) => {
    // force logout and relogin
    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('isLoggedin');
      // window.location.href = '/auth/login';

      return false; // error handled
    }

    return true; // error not handled
  });
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, `${window.appConfig.apiBaseUrl}/i18n/`, '.json');
  // return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, SpinnerComponent, BlankComponent, FullComponent, DashboardLayoutComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(Approutes, { useHash: false }),
    // Importing RestangularModule and making default configs for restanglar
    RestangularModule.forRoot(RestangularConfigFactory),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    NgSelectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NgxStripeModule.forRoot(),
    UtilsModule,
    FontAwesomeModule
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy // HashLocationStrategy
    },
    AuthService,
    AuthGuard,
    ConfigResolver,
    LanguageResolver,
    CategoryResolver,
    CategoryService,
    StripeServiceAccount
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
