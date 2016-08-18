///<reference path="../../../typings/window.extend.d.ts"/>
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ILocation, Location, LatLng } from '../location';
import { GeolocationService } from '../geolocation.service';
import { LocationsService } from '../locations.service';
import { timeStamp, uniqueArray, removeItemFromArray } from '../utils';
import { Store } from '@ngrx/store';
import { SET_JOIN_ID, SET_LOCATION_ID, SET_MY_LOCATION, TOGGLE_CONTACTS_PANEL, ISettings } from '../reducers/settings';
import { AppState } from '../app.component';

@Component({
    moduleId: module.id,
    selector: 'app-map',
    templateUrl: 'map.component.html',
    styleUrls: ['map.component.css'],
    providers: [LocationsService, GeolocationService]
})
export class MapComponent implements OnInit {

    app: Observable<any>;
    settings: ISettings;
    map: any;
    newUser: boolean = false;                               //
    options: any = { zoom: 12 };
    icon: any = {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: 'white',
        fillOpacity: 0.8,
        scale: 15,
        strokeColor: 'blue',
        strokeWeight: 4
    };
    markers: any;
    bounds: any;
    showContacts: boolean = false;
    autoScale: boolean = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private locationsService: LocationsService,
        private geoService: GeolocationService,
        private store: Store<AppState>
    ) {
        this.markers = new Map;
        this.app = store.select('settings');
    }

    ngOnInit() {
        this.resetBounds();
        this.show();
        this.app.subscribe((s) => { this.updateMap(s); });
        //this.geoService.watch(this.updateMyLocation.bind(this));
    }

    private resetBounds() {
        this.bounds = new window.google.maps.LatLngBounds();
    }

    public show() {
        if (window.google) {
            this.map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: this.options.zoom,
                center: this.options.centre
            });
        }
    }

    updateMap(settings: ISettings) {
        this.settings = <ISettings>settings;
        console.log('settings', settings)                                           //
        this.displayMarkers(settings.myPins);
    }

    private displayMarkers(markers: ILocation[]) {
        console.log('display markers', markers)                                      //
        this.removeAllMarkers();
        markers.forEach((m) => { 
            if (m !== undefined) { this.addMarker(m); }
        });
        if (this.autoScale) { this.scaleToFit(); /*this.autoScale = false;*/ }      //TODO: sort our autoscale
    }

    private addMarker(marker: ILocation) {
        let mapMarker = this.makeGoogleMarker(marker);
        this.addToMarkersList(marker.$key, mapMarker);
    }

    private makeGoogleMarker(marker: ILocation): any {
        let symbol = Object.assign({}, this.icon, { strokeColor: marker.color });
        return new window.google.maps.Marker({
            position: marker.position,
            map: this.map,
            icon: symbol,
            title: marker.name,
            label: marker.name
        });
    }

    private addToMarkersList(id: string, marker: Location) {
        this.markers.set(id, marker);
    }

    private findInMarkersList(key: string): any {
        return this.markers.get(key);
    }

    private scaleToFitNewMarker(marker: any) {
        this.bounds.extend(marker.getPosition());
        // Don't zoom too close if only one marker
        if (this.bounds.getNorthEast().equals(this.bounds.getSouthWest())) {
            var extendPoint1 = new window.google.maps.LatLng(this.bounds.getNorthEast().lat() + 0.005, this.bounds.getNorthEast().lng() + 0.005);
            var extendPoint2 = new window.google.maps.LatLng(this.bounds.getNorthEast().lat() - 0.005, this.bounds.getNorthEast().lng() - 0.005);
            this.bounds.extend(extendPoint1);
            this.bounds.extend(extendPoint2);
        }
        this.map.fitBounds(this.bounds);
    }

    private removeAllMarkers() {
        this.markers.forEach((m) => { m.setMap(null); });
        this.markers.clear();
        this.resetBounds();
    }

    private centreMe($event) {
        this.map.panTo(this.settings.myLocation.position);
    }

    private scaleToFit() {
        this.resetBounds();
        this.markers.forEach((m) => { this.scaleToFitNewMarker(m); });
    }

    private addPeople($event) {
        this.router.navigate(['../invite/', this.settings.locationId], { relativeTo: this.route });
    }

    private unlinkContact(contact: ILocation) {
        this.unlinkMeFromContact(contact);
        this.unlinkContactFromMe(contact);
    }

    private unlinkMeFromContact(contact: ILocation) {
        removeItemFromArray(contact.contacts, this.settings.locationId);
        console.log('unlinking me from contact', contact.contacts)                      //
        this.locationsService.updateByKey(contact.$key, { contacts: contact.contacts, updated: timeStamp });
    }

    private unlinkContactFromMe(contact: ILocation) {
        removeItemFromArray(this.settings.myLocation.contacts, contact.$key);
        this.locationsService.updateByKey(this.settings.locationId, { contacts: this.settings.myLocation.contacts, updated: timeStamp });
    }

    toggleContacts($event) {
        this.showContacts = !this.showContacts;
    }

}

//firebase.database().ref('locations').child('-KMcS5szYoEpMtkvrekI').child('location').update({lng: -2.7016700, lat: 51.1417600});