import { Injectable } from '@angular/core';
import {
  AngularFire,
  FirebaseListObservable,
  FirebaseObjectObservable
} from 'angularfire2';
import { ILocation } from './location';

@Injectable()
export class LocationsService {

  locations$: FirebaseListObservable<ILocation[]>;

  constructor(private af: AngularFire) {
    this.locations$ = af.database.list('/locations');
  }

  add(location: ILocation): Promise<any> {
    return this.locations$.push(location);
  }

  remove(location: ILocation): Promise<any> {
    return this.locations$.remove(location.$key);
  }

  update(location: ILocation, changes: any): Promise<any> {
    return this.locations$.update(location.$key, changes);
  }

  // addContact(locationId: string, contact: any): Promise<any> {
  //   let contacts$ = this.af.database.list('/locations/' + locationId + '/contacts');
  //   return contacts$.push({ contact: contact });
  // }

  // removeContact(location: ILocation, contactId: string) {
  //   let contacts$ = this.af.database.list('/locations/' + location.$key + '/contacts');
  //   for (let c of Object.keys(location.contacts)) {
  //     if (location.contacts[c].contact === contactId) { return contacts$.remove(c); }
  //   };
  // }

  getLocationByKey(key: string): Promise<any> {
    let loc: ILocation[] = [];
    return new Promise((resolve: any, reject: any) => {
      this.locations$.subscribe((l) => {
        let item = l[l.length - 1];
        if ((item !== undefined) && (item.$key === key)) { resolve(item); }
      }, reject);
    });
  }

  updateByKey(key: string, changes: any): Promise<any> {
    return this.locations$.update(key, changes);
  }

}
