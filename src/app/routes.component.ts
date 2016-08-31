import { Routes, RouterModule }  from '@angular/router';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { InviteComponent } from './invite/invite.component';
import { NogeoComponent } from './nogeo/nogeo.component';
import { NewuserComponent } from './newuser/newuser.component';

const routes: Routes = [
  { path: '', redirectTo: 'map', terminal: true },
  { path: 'map', component: MapComponent },
  { path: 'join/:id', component: MapComponent },
  { path: 'invite/:id', component: InviteComponent },
  { path: 'nogeo', component: NogeoComponent }
];

export const routing = RouterModule.forRoot(routes);