import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  LOCALE_ID,
} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {registerLocaleData} from '@angular/common';
import localeTr from '@angular/common/locales/tr';

import {routes} from './app.routes';

registerLocaleData(localeTr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    {provide: LOCALE_ID, useValue: 'tr-TR'},
  ],
};

