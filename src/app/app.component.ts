import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SET_JOIN_ID, SET_LOCATION_ID, SET_MY_LOCATION, SET_CONTACTS, UPDATE_SETTINGS, ISettings } from './reducers/settings';
import { GeolocationService } from './geolocation.service';
import { LocationsService } from './locations.service';
import { ILocation, Location, LatLng } from './location';
import { timeStamp, uid } from './utils';
import * as moment from 'moment';

export interface AppState {
  settings: ISettings;
}

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [GeolocationService, LocationsService]
})
export class AppComponent implements OnInit {

  locationKey: string = 'proximateLocationId';
  locationId: string;
  locations$: Observable<ILocation[]>;
  app: Observable<any>;
  newUser: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private geolocationService: GeolocationService,
    private locationsService: LocationsService,
    public store: Store<AppState>
  ) {
    this.locationId = window.localStorage.getItem(this.locationKey);
    this.newUser = (this.locationId === null) ? true : false;
    this.locations$ = locationsService.locations$;
    this.app = store.select('settings');
  }

  ngOnInit() {
    // Get stream of locations from Firebase and filter for my contacts
    this.subscribeToFirebase();
    this.getGeoPosition(this.locationId);
  }

  getGeoPosition(locationId: string) {
    this.geolocationService.getLocation()
      .then((position: any) => { 
        this.setLocation({ lat: position.latitude, lng: position.longitude }, locationId);
      })
      .catch((error: any) => {
        console.log('Geo error', error)                                             //
        //this.router.navigate(['./nogeo'], { relativeTo: this.route });
      });
  }

  setLocation(position: LatLng, locationId: string) {
    let location = new Location(position);
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
      .then((v) => { 
        this.storeLocationId(v.key);
        this.locationsService.updateByKey(v.key, { updated: timeStamp });  // Forces refresh after locationId is stored
      });
  }

  updateLocation(location: ILocation) {
    this.locationsService.update(location, { position: location.position, updated: timeStamp });
  }

  subscribeToFirebase() {
    this.locations$.subscribe((l) => { this.filterLocations(l); });
  }

  // Filter for locations that include me as a contact and were updated in last 24 hours
  filterLocations(locations: ILocation[]): void {
    let myLocation = this.filterByKey(locations, this.locationId);
    let contacts = this.filterMyContacts(locations);
    let combined = [].concat(...contacts).concat(myLocation);
    this.store.dispatch({
      type: UPDATE_SETTINGS, payload: {
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
    window.localStorage.setItem(this.locationKey, id);
    //this.store.dispatch({ type: SET_LOCATION_ID, payload: id });
  }

}
