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
  }
}

//export version and build number to global
window.appConfig = {
  version: environment.version,
  build: environment.build,
  apiBaseUrl: environment.apiBaseUrl,
  platform: environment.platform,
  maximumFileSize: environment.maximumFileSize
};

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
