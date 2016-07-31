import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SET_JOIN_ID, SET_LOCATION_ID, SET_MY_LOCATION, SET_CONTACTS, UPDATE_SETTINGS, ISettings } from './reducers/settings';
import { GeolocationService } from './geolocation.service';
import { LocalstorageService } from './localstorage.service';
import { LocationsService } from './locations.service';
import { ILocation, Location, LatLng } from './location';
import { timeStamp } from './utils';
import * as moment from 'moment';

export interface AppState {
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

  locationKey: string = 'proximateLocationId';
  locationId: string;
  appSettings: Observable<any>;
  locations$: Observable<ILocation[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localstorageService: LocalstorageService,
    private geolocationService: GeolocationService,
    private locationsService: LocationsService,
    public store: Store<AppState>
  ) {
    this.appSettings = store.select('settings');
    this.locations$ = locationsService.locations$;
  }

  ngOnInit() {
    let id = this.getLocalId();
    if (id) { this.storeLocationId(id); }
    this.getGeoPosition(id);
  }

  getLocalId(): string {
    return this.localstorageService.get(this.locationKey);
  }

  getGeoPosition(locationId: string) {
    this.geolocationService.getLocation()
      .then((position: any) => { this.setLocation(position, locationId); })
      .catch((error: any) => {
        console.log('Geo error', error)                                             //
        //this.router.navigate(['./nogeo'], { relativeTo: this.route });
      });
  }

  setLocation(position: any, locationId: string) {
    let location = new Location({ lat: position.latitude, lng: position.longitude });
    this.addOrUpdateLocationInDatabase(location, locationId);
  }

  addOrUpdateLocationInDatabase(location: ILocation, locationId: string) {
    if (locationId === null) {
      this.addLocation(location);
    } else {
      location.$key = locationId;
      this.updateLocation(location);
    }
  }

  addLocation(location: ILocation) {
    this.locationsService.add(location)
      .then((v) => { this.storeLocationId(v.key); })
      .then(this.subscribeToFirebase)
  }

  updateLocation(location: ILocation) {
    console.log('[App] Updating geo position')                            //
    this.locationsService.update(location, { position: location.position, updated: timeStamp });
    this.subscribeToFirebase();
  }

  subscribeToFirebase() {
    this.locations$.subscribe((l) => { this.filterLocations(l); });
  }

  // Filter for locations that include me as a contact and were updated in last 24 hours
  filterLocations(locations: ILocation[]): void {
    console.log('[App] Filtering locations')                            //
    let myLocation = this.filterByKey(locations, this.locationId);
    let contacts = this.filterMyContacts(locations);
    let combined = [].concat(...contacts).concat(myLocation);
    console.log('[App] Updating store')                                 //
    this.store.dispatch({ type: UPDATE_SETTINGS, payload: {
        contacts: contacts,
        myLocation: myLocation,
        myPins: combined,
        initialised: true
      }
    });
  }

  public filterByKey(locations: ILocation[], key: string): ILocation {
    return locations.filter((l) => { return l.$key === key; })[0];
  }

  filterMyContacts(locations: ILocation[]): ILocation[] {
    return locations.filter((l) => {
      return this.isLinkedToMyLocationId(l) && this.hasUpdatedInLastDay(l);
    });
  }

  // testForNewUser(location: ILocation): void {
  //   if ((location.$key === this.locationId) && (location.name === 'Me')) { this.newUser = true; }
  // }

  private containsMyLocationId(location: ILocation): boolean {
    return (this.isMyLocationId(location) || this.isLinkedToMyLocationId(location)) ? true : false;
  }

  private isMyLocationId(location: ILocation): boolean {
    return (location.$key === this.locationId) ? true : false;
  }

  private isLinkedToMyLocationId(location: ILocation): boolean {
    return location.contacts && (location.contacts.indexOf(this.locationId) > -1) ? true : false;
  }

  private hasUpdatedInLastDay(location: ILocation): boolean {
    return (moment().diff(moment(location.updated), 'days') === 0);
  }

  storeLocationId(id) {
    this.locationId = id;
    this.store.dispatch({ type: SET_LOCATION_ID, payload: id });
    this.localstorageService.set(this.locationKey, id);
  }

}
