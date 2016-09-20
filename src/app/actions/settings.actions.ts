import { Injectable } from '@angular/core';
import {
  AngularFire,
  FirebaseListObservable,
  FirebaseObjectObservable
} from 'angularfire2';
import { IAppState } from '../store';
import { NgRedux } from 'ng2-redux';
import {
  INITIALISED,
  SET_LOCATION_ID,
  SET_MY_LOCATION,
  SET_CONTACTS,
  UPDATE_SETTINGS,
  RESET
} from '../constants';
import { ILocation } from '../location';
import * as moment from 'moment';
import { timeStamp, uniqueArray } from '../utils';


@Injectable()
export class SettingsActions {

  locations$: FirebaseListObservable<ILocation[]>;

  constructor(
    private _ngRedux: NgRedux<IAppState>,
    private af: AngularFire
  ) {
    this.locations$ = af.database.list('/locations');
  }

  update = (details) => {
    return this._ngRedux.dispatch({
      type: UPDATE_SETTINGS,
      payload: details
    });
  };

  setLocationId = (id) => {
    return this._ngRedux.dispatch({
      type: SET_LOCATION_ID,
      payload: { locationId: id }
    });
  };

  // Subscribe to Firebase, filter and write to State
  getLocations = (locationId: string) => {
    return this.locations$.subscribe((snapshot) => { this.filterLocations(snapshot, locationId); });
  };

  addLocation = (location: ILocation): firebase.database.ThenableReference => {
    return this.locations$.push(location);
  };

  removeLocation = (location: ILocation): firebase.Promise<void> => {
    return this.locations$.remove(location.$key);
  };

  updateLocation = (location: ILocation, changes: any): firebase.Promise<void> => {
    return this.locations$.update(location.$key, changes);
  };

  getLocationByKey = (key: string): Promise<any> => {
    let loc: ILocation[] = [];
    return new Promise((resolve: any, reject: any) => {
      this.locations$.subscribe((l) => {                      // Do we need to unsubscribe to free memory?
        let item = l[l.length - 1];
        if ((item !== undefined) && (item.$key === key)) { resolve(item); }
      }, reject);
    });
  };

  updateLocationByKey = (key: string, changes: any): firebase.Promise<void> => {
    return this.locations$.update(key, changes);
  };

  // Filter for locations that include me as a contact and were updated in last 24 hours
  filterLocations(locations: ILocation[], locationId: string): void {
    let myLocation = this.filterByKey(locations, locationId);
    let contacts = this.filterMyContacts(locations, locationId);
    let combined = [].concat(...contacts).concat(myLocation);
    this.update({
      contacts: contacts,
      myLocation: myLocation,
      myPins: combined,
      initialised: true
    });
  }

  public filterByKey(locations: ILocation[], key: string): ILocation {
    return locations.filter((l) => { return l.$key === key; })[0];
  }

  filterMyContacts(locations: ILocation[], locationId: string): ILocation[] {
    return locations.filter((l) => {
      return this.isLinkedToMyLocationId(l, locationId) && this.hasUpdatedInLastDay(l);
    });
  }

  // private containsMyLocationId(location: ILocation): boolean {
  //   return (this.isMyLocationId(location) || this.isLinkedToMyLocationId(location)) ? true : false;
  // }

  // private isMyLocationId(location: ILocation, locationId: string): boolean {
  //   return (location.$key === locationId) ? true : false;
  // }

  private isLinkedToMyLocationId(location: ILocation, locationId: string): boolean {
    return location.contacts && (location.contacts.indexOf(locationId) > -1) ? true : false;
  }

  private hasUpdatedInLastDay(location: ILocation): boolean {
    return (moment().diff(moment(location.updated), 'days') === 0);
  }

  linkUsers = (theirId: string) => {
    this.getLocationByKey(theirId)
      .then((match) => {
        this.linkMeToThem(theirId);
        this.linkThemToMe(match);
      })
      .catch(error => console.log('Error linking user', theirId, error));
  };

  linkMeToThem = (theirId: string) => {
    let c: string[] = [theirId];
    let s: any = this._ngRedux.getState().settings;
    if (s.myLocation.contacts) { c = uniqueArray(c.concat(s.myLocation.contacts)); }
    this.updateLocationByKey(s.locationId, { contacts: c, updated: timeStamp });
  };

  linkThemToMe(theirLocation: ILocation) {
    let s: any = this._ngRedux.getState().settings;
    let c: string[] = [s.locationId];
    if (theirLocation.contacts) { c = uniqueArray(c.concat(theirLocation.contacts)); }
    this.updateLocationByKey(theirLocation.$key, { contacts: c, updated: timeStamp });
  }

}
