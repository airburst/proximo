import { provideRouter, RouterConfig }  from '@angular/router';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { JoinComponent } from './join/join.component';
import { InviteComponent } from './invite/invite.component';
import { NogeoComponent } from './nogeo/nogeo.component';
import { NewuserComponent } from './newuser/newuser.component';

const routes: RouterConfig = [
  //{ path: '', redirectTo: 'map', terminal: true },
  { path: '', component: MapComponent },
  { path: 'join/:id', component: JoinComponent },
  { path: 'invite/:id', component: InviteComponent },
  { path: 'nogeo', component: NogeoComponent },
  { path: 'newuser', component: NewuserComponent },
  { path: 'newuser/:id', component: NewuserComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];