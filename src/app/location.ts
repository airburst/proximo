/* tslint:disable:no-string-literal */
//import {uid} from './utils';

export interface LatLng {
    lat: number;
    lng: number;
}

export interface ILocation {
    $key: string;
    //id: string;
    name: string;
    position: LatLng;
    color: string;
    contacts: string[];
    updated: string;
}

export class Location implements ILocation {
    $key: string;
    //id: string;
    name: string;
    position: LatLng;
    color: string;
    contacts: string[];
    updated: string;

    constructor(latLng: LatLng, name: string = 'Me', color: string = 'blue') {
        //this.id = uid();
        this.name = name;
        this.position = latLng;
        this.color = color;
        this.contacts = [];
        this.updated = new Date().toISOString();
    }
    
}