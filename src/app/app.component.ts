import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import {GeolocationService} from './geolocation.service';
import {LocalstorageService} from './localstorage.service';
import {LocationsService} from './locations.service';
import {Location, LatLng} from './location';
import {MapComponent} from './map/map.component';
import {MockPath} from './mock';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES, MapComponent],
  providers: [GeolocationService, LocalstorageService, LocationsService]
})
export class AppComponent implements OnInit {

  locationId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localstorageService: LocalstorageService,
    private geolocationService: GeolocationService,
    private locationsService: LocationsService
  ) { }

  ngOnInit() {
    this.initialiseData();
  }

  initialiseData() {
    this.locationId = this.localstorageService.get('proximoLocationId');
    this.getPosition();
  }

  getPosition() {
    this.geolocationService.getLocation()
      .then((position: any) => { this.setLocation(position); })
      .catch((error: any) => {
        this.router.navigate(['./nogeo'], { relativeTo: this.route });
      });
  }

  setLocation(position: any) {
    let pos = { lat: position.latitude, lng: position.longitude },
      location = new Location(pos, 'Me', 'blue'); //TODO: capture name and colour from form
    if (this.locationId === null) { 
      this.addLocation(location); 
    } else {
      this.updateLocation(this.locationId, pos);  //NOTE: this can create a new location with just a position
    }
  }

  addLocation(location: Location) {
    this.locationsService.add(location)
      .then((v) => {
        this.locationId = v.key;
        this.localstorageService.set('proximoLocationId', this.locationId);
      });
  }

  updateLocation(id: string, position: LatLng) {
    this.locationsService.updateByKey(id, { position: position, updated: new Date().toISOString() });
  }

}
