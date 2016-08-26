import {ILocation} from '../location';
import { 
    INITIALISED,
    SET_LOCATION_ID, 
    SET_MY_LOCATION, 
    SET_CONTACTS, 
    UPDATE_SETTINGS,
    RESET 
} from '../constants';

export interface ISettings {
    locationId: string;
    newUser: boolean;
    myLocation: ILocation;
    contacts: ILocation[];
    myPins: ILocation[];
    initialised: boolean;
}

const initialSettings = {
    locationId: null,
    newUser: false,
    myLocation: null,
    contacts: [],
    myPins: [],
    initialised: false
}

export function settingsReducer(state: ISettings = initialSettings, action: any) {
    switch (action.type) {

        case INITIALISED:
            return Object.assign({}, state, { initialised: true });
            
        case SET_LOCATION_ID:
            return Object.assign({}, state, { locationId: action.payload });

        case SET_MY_LOCATION:
            return Object.assign({}, state, { myLocation: action.payload });

        case SET_CONTACTS:
            return Object.assign({}, state, { contacts: action.payload });
        
        case UPDATE_SETTINGS:
            return Object.assign({}, state, action.payload);

        case RESET:
            return (state = initialSettings);

        default:
            return state;
    }

};