import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from './environments/environment';
import { provideServiceWorker } from '@angular/service-worker';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
});
