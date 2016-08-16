import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  Validators,
  FormBuilder,
  FormGroup,
  AbstractControl
} from '@angular/forms';
import { ILocation } from '../location';
import { Store } from '@ngrx/store';
import { SET_JOIN_ID, ISettings } from '../reducers/settings';
import { AppState } from '../app.component';
import { timeStamp, uniqueArray, removeItemFromArray } from '../utils';
import { LocationsService } from '../locations.service';

@Component({
  moduleId: module.id,
  selector: 'app-join',
  templateUrl: 'join.component.html',
  styleUrls: ['join.component.css'],
  providers: [LocationsService]
})
export class JoinComponent implements OnInit {

  app: Observable<any>;
  settings: ISettings;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private locationsService: LocationsService,
    private store: Store<AppState>
  ) {
    this.app = store.select('settings');
  }

  ngOnInit() {
    this.app.subscribe((settings) => {
      if (settings.initialised) {
        this.settings = settings;
        if (settings.joinId === null) {
          this.setJoinIdFromUrl();
        } else {
          if (settings.joinId !== settings.locationId) {
            this.linkUsers(settings.joinId);
          }
        }
      }
    });
  }

  setJoinIdFromUrl() {
    this.route.params.subscribe(params => {
      if (params['id']) { this.store.dispatch({ type: SET_JOIN_ID, payload: params['id'] }); }
    });   // The router will throw an error if there was no :id path
  }

  linkUsers(theirId: string) {                          //TODO move into locationsService
    this.locationsService.getLocationByKey(theirId)
      .then((match) => {
        this.linkMeToThem(theirId);
        this.linkThemToMe(match);
        this.goToMap();
      })
      .catch(error => console.log(error));
  }

  private isMyLocationId(location: ILocation): boolean {
    return (location.$key === this.settings.locationId) ? true : false;
  }

  linkMeToThem(theirId: string) {
    let c: string[] = [theirId];
    if (this.settings.myLocation.contacts) { c = uniqueArray(c.concat(this.settings.myLocation.contacts)); }
    this.locationsService.updateByKey(this.settings.locationId, { contacts: c, updated: timeStamp });
  }

  linkThemToMe(theirLocation: ILocation) {
    let c: string[] = [this.settings.locationId];
    if (theirLocation.contacts) { c = uniqueArray(c.concat(theirLocation.contacts)); }
    this.locationsService.updateByKey(theirLocation.$key, { contacts: c, updated: timeStamp });
  }

  // testForNewUser(location: ILocation): void {
  //   if ((location.$key === this.settings.locationId) && (location.name === 'Me')) { this.newUser = true; }
  // }

  public filterByKey(locations: ILocation[], key: string): ILocation {
    return locations.filter((l) => { return l.$key === key; })[0];
  }

  goToMap() {
    this.router.navigate(['/'], { relativeTo: this.route });
  }

}
