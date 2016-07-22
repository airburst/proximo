import { provideRouter, RouterConfig }  from '@angular/router';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { NogeoComponent } from './nogeo/nogeo.component';

const routes: RouterConfig = [
  //{ path: '', redirectTo: 'map', terminal: true },
  { path: '', component: MapComponent },
  { path: 'join/:id', component: MapComponent },
  { path: 'nogeo', component: NogeoComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];