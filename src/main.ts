import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { provideForms } from '@angular/forms';
import { FIREBASE_PROVIDERS, defaultFirebase } from 'angularfire2';
import { AppComponent, environment } from './app/';
import { APP_ROUTER_PROVIDERS } from './app/routes.component';
import { provideStore } from '@ngrx/store';
import { settingsReducer } from './app/reducers/settings';

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent, [
  provideStore({ settings: settingsReducer }),
  HTTP_PROVIDERS,
  APP_ROUTER_PROVIDERS,
  provideForms,
  FIREBASE_PROVIDERS,
  // Initialize Firebase app  
  defaultFirebase({
    apiKey: "AIzaSyDGe_FmSZBr74_Eo9rbe-Ld9r264Ay47hE",
    authDomain: "proximo-55720.firebaseapp.com",
    databaseURL: "https://proximo-55720.firebaseio.com",
    storageBucket: "",
  })
]);