import {ActionReducer, Action} from '@ngrx/store';
import {ILocation} from '../location';

export const INITIALISED = 'INITIALISED';
export const SET_LOCATION_ID = 'SET_LOCATION_ID';
export const SET_JOIN_ID = 'SET_JOIN_ID';
export const UNSET_JOIN_ID = 'UNSET_JOIN_ID';
export const SET_MY_LOCATION = 'SET_MY_LOCATION';
export const SET_CONTACTS = 'SET_CONTACTS';
export const TOGGLE_CONTACTS_PANEL = 'TOGGLE_CONTACTS_PANEL';
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const RESET = 'RESET';

export interface ISettings {
    locationId: string;
    joinId: string;
    myLocation: ILocation;
    contacts: ILocation[];
    myPins: ILocation[];
    showContactsPanel: boolean;
    initialised: boolean;
    // centre map
    // scale to fit
}

const initialSettings = {
    locationId: null,
    joinId: null,
    myLocation: null,
    contacts: [],
    myPins: [],
    showContactsPanel: false,
    initialised: false
}

export const settingsReducer: ActionReducer<ISettings> = (state: ISettings = initialSettings, action: Action) => {

    switch (action.type) {

        case INITIALISED:
            return Object.assign({}, state, { initialised: true });
            
        case SET_LOCATION_ID:
            return Object.assign({}, state, { locationId: action.payload });

        case SET_JOIN_ID:
            return Object.assign({}, state, { joinId: action.payload });

        case UNSET_JOIN_ID:
            return Object.assign({}, state, { joinId: null });

        case SET_MY_LOCATION:
            return Object.assign({}, state, { myLocation: action.payload });

        case SET_CONTACTS:
            return Object.assign({}, state, { contacts: action.payload });
            
        case TOGGLE_CONTACTS_PANEL:
            return Object.assign({}, state, { showContactsPanel: !state.showContactsPanel });
        
        case UPDATE_SETTINGS:
            return Object.assign({}, state, action.payload);

        case RESET:
            return (state = initialSettings);

        default:
            return state;
    }

};