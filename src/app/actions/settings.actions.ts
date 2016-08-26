import { Injectable } from '@angular/core';
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

@Injectable()
export class SettingsActions {

  constructor(private _ngRedux: NgRedux<IAppState>) { }

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

}
