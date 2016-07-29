import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SET_JOIN_ID, SET_LOCATION_ID, SET_MY_LOCATION, TOGGLE_CONTACTS_PANEL, ISettings } from './reducers/settings';
import { GeolocationService } from './geolocation.service';
import { LocalstorageService } from './localstorage.service';
import { LocationsService } from './locations.service';
import { ILocation, Location, LatLng } from './location';
import { timeStamp } from './utils';

interface AppState {
  settings: ISettings;
}

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [GeolocationService, LocalstorageService, LocationsService]
})
export class AppComponent implements OnInit {

  appSettings: Observable<any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localstorageService: LocalstorageService,
    private geolocationService: GeolocationService,
    private locationsService: LocationsService,
    public store: Store<AppState>
  ) {
    this.appSettings = store.select('settings');

    store.subscribe((s) => console.log(s))
  }

  ngOnInit() {
    this.initialiseData();
  }

  initialiseData() {
    let id = this.getLocalId();
    if (id) { this.storeLocationId(id); }
    this.getGeoPosition(id);    // Can be null
  }

  getLocalId(): string {
    return this.localstorageService.get('proximoLocationId');
  }

  getGeoPosition(locationId: string) {
    console.log('local id', locationId)             //
    this.geolocationService.getLocation()
      .then((position: any) => { this.setLocation(position, locationId); })
      .catch((error: any) => {
        this.router.navigate(['./nogeo'], { relativeTo: this.route });
      });
  }

  setLocation(position: any, locationId: string) {
    let location = new Location({ lat: position.latitude, lng: position.longitude });
    location.$key = locationId;
    this.addOrUpdateLocationInDatabase(location);
  }

  addOrUpdateLocationInDatabase(location: ILocation) {
    if (location.$key === null) {
      console.log('Adding new location')        //
      this.addLocation(location);
    } else {
        console.log('Updating location', location.$key)      //
      this.updateLocation(location);
    }
  }

  addLocation(location: ILocation) {
    this.locationsService.add(location)
      .then((v) => { this.storeLocationId(v.key) })
  }

  updateLocation(location: ILocation) {
    this.locationsService.update(location, { position: location.position, updated: timeStamp });
  }

  storeLocationId(id) {
    this.store.dispatch({ type: SET_LOCATION_ID, payload: id });
    this.localstorageService.set('proximoLocationId', id);
  }

}
