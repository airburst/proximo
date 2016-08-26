import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GeolocationService } from './geolocation.service';
import { ILocation, Location, LatLng } from './location';
import { timeStamp } from './utils';
import { select } from 'ng2-redux';
import { ISettings } from './store';
import { SettingsActions } from './actions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [GeolocationService]
})
export class AppComponent implements OnInit {

  locationKey: string = 'proximateLocationId';
  locationId: string;
  newUser: boolean;

  @select() settings$: Observable<ISettings>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private geolocationService: GeolocationService,
    private settingsActions: SettingsActions
  ) {
    this.locationId = window.localStorage.getItem(this.locationKey);
    this.newUser = (this.locationId === null) ? true : false;
  }

  ngOnInit() {
    this.settingsActions.update({ locationId: this.locationId, newUser: this.newUser });
    this.subscribeToFirebase();
    this.getGeoPosition(this.locationId);
  }

  getGeoPosition(locationId: string) {
    this.geolocationService.getLocation()
      .then((position: any) => {
        this.setLocation({ lat: position.latitude, lng: position.longitude }, locationId);    //TODO: Action Dispatch
      })
      .catch((error: any) => {
        console.log('Geo error', error)        //
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
    this.settingsActions.addLocation(location)
      .then((l) => { 
        this.storeLocationId(l.key); 
        this.settingsActions.updateLocationByKey(l.key, { updated: timeStamp });  // Forces refresh after locationId is stored
      });
  }

  updateLocation(location: ILocation) {
    this.settingsActions.updateLocation(location, { position: location.position, updated: timeStamp });
  }

  subscribeToFirebase() {
    this.settingsActions.getLocations(this.locationId);
  }

  storeLocationId(id) {
    this.locationId = id;
    window.localStorage.setItem(this.locationKey, id);
    this.settingsActions.setLocationId(id);
  }

}
