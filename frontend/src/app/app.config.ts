import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER, PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

/**
 * Captures ?ref= or ?utm_source= query params before Angular's router
 * strips them via redirects (e.g. / → /dashboard in dev mode, or SSR 302).
 * Stores in a cookie (survives redirects) with 5 min TTL.
 */
function captureAnalyticsRef(platformId: object) {
  return () => {
    if (!isPlatformBrowser(platformId)) return;
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref') || params.get('utm_source');
      if (ref) {
        document.cookie = 'analytics_ref=' + encodeURIComponent(ref) + ';path=/;max-age=300;SameSite=Lax';
      }
    } catch { /* ignore */ }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      useFactory: captureAnalyticsRef,
      deps: [PLATFORM_ID],
      multi: true,
    },
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: { fontSet: 'material-symbols-outlined' },
    },
  ],
};
