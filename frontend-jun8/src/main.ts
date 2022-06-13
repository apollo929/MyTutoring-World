import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

declare global {
  interface Window {
    appConfig: any;
    appData: any;
  }
}

//export version and build number to global
window.appConfig = environment;

// init data for the app
window.appData = {};

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
