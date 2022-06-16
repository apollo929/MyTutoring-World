import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { RestangularModule, Restangular } from 'ngx-restangular';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';

import { FullComponent } from './layouts/full/full.component';
import { AuthLayoutComponent } from './layouts/auth/auth.component';

import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { AuthService } from './shared/services';
import { AuthGuard } from './shared/guard/auth.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/font_family.min.js';
import 'froala-editor/js/plugins/line_height.min.js';
import 'froala-editor/js/plugins/quote.min.js';
import 'froala-editor/js/plugins/url.min.js';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/edit_in_popup.min.js';
// Import a Froala Editor language file.
import 'froala-editor/js/languages/de.js';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ImageCropperModule } from 'ngx-image-cropper';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';

import { ConfigResolver } from './shared/resolver';

import { MediaModule } from './media/media.module';

// Function for setting the default restangular configuration
export function RestangularConfigFactory(RestangularProvider) {
  // TODO - change default config
  RestangularProvider.setBaseUrl(window.appConfig.apiBaseUrl);
  RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params) => {
    // Auto add token to header
    headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    headers.platform = window.appConfig.platform;
    return {
      headers: headers
    };
  });

  RestangularProvider.addErrorInterceptor((response, subject, responseHandler) => {
    // force logout and relogin
    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('isLoggedin');
      window.location.href = '/auth/login';

      return false; // error handled
    }

    return true; // error not handled
  });
}

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    AuthLayoutComponent,
    BreadcrumbComponent,
    SidebarComponent
  ],
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
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    NgSelectModule,
    ImageCropperModule,
    MediaModule
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy // HashLocationStrategy
    },
    AuthService,
    AuthGuard,
    ConfigResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
