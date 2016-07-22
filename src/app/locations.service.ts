import { Injectable } from '@angular/core';
import {
  AngularFire,
  FirebaseListObservable,
  FirebaseObjectObservable
} from 'angularfire2';
import {ILocation} from './location';

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

  updateByKey(key: string, changes: any): Promise<any> {
    return this.locations$.update(key, changes);
  }

}
