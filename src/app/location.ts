/* tslint:disable:no-string-literal */
export interface LatLng {
    lat: number;
    lng: number;
}

export interface ILocation {
    $key: string;
    name: string;
    position: LatLng;
    color: string;
    contacts: string[];
    updated: string;
}

export class Location implements ILocation {
    $key: string;
    name: string;
    position: LatLng;
    color: string;
    contacts: string[];
    updated: string;

    constructor(latLng: LatLng, name: string = '', color: string = 'red') {
        this.name = name;
        this.position = latLng;
        this.color = color;
        this.contacts = [];
        this.updated = new Date().toISOString();
    }
}