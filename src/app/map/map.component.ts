///<reference path="../../../typings/window.extend.d.ts"/>
import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/filter';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MdToolbar } from '@angular2-material/toolbar';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
import {ILocation, Location, LatLng} from '../location';
import {GeolocationService} from '../geolocation.service';
import {LocationsService} from '../locations.service';
import {LocalstorageService} from '../localstorage.service';
import {ContactsComponent} from '../contacts/contacts.component';
import {timeStamp, uniqueArray, removeItemFromArray} from '../utils';
import { Store } from '@ngrx/store';
import { SET_JOIN_ID, SET_LOCATION_ID, SET_MY_LOCATION, TOGGLE_CONTACTS_PANEL, ISettings } from '../reducers/settings';
import { AppState } from '../app.component';

@Component({
    moduleId: module.id,
    selector: 'app-map',
    templateUrl: 'map.component.html',
    styleUrls: ['map.component.css'],
    directives: [ROUTER_DIRECTIVES, MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES, MD_LIST_DIRECTIVES, MdIcon, MdToolbar, ContactsComponent],
    providers: [MdIconRegistry, LocationsService, LocalstorageService, GeolocationService]
})
export class MapComponent implements OnInit {

    app: Observable<any>;
    settings: ISettings;
    map: any;
    newUser: boolean = false;
    options: any = { zoom: 12 };
    icon: any = {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: 'white',
        fillOpacity: 0.8,
        scale: 14,
        strokeColor: 'blue',
        strokeWeight: 2
    };
    markers: any;
    bounds: any;
    showContacts: boolean = false;
    autoScale: boolean = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private locationsService: LocationsService,
        private localstorageService: LocalstorageService,
        private geoService: GeolocationService,
        private store: Store<AppState>
    ) {
        this.markers = new Map;
        this.app = store.select('settings');
        this.app.subscribe((s) => {
            this.updateMap(s);
        });
    }

    ngOnInit() {
        this.resetBounds();
        this.show();
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
        this.displayMarkers(settings.myPins);
    }

    private displayMarkers(markers: ILocation[]) {
        this.removeAllMarkers();
        markers.forEach((m) => { this.addMarker(m); });
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

    // Unlink contact (both ways)
    private unlinkContact(contact: ILocation) {
        removeItemFromArray(contact.contacts, this.settings.locationId);
        this.locationsService.updateByKey(contact.$key, { contacts: contact.contacts, updated: timeStamp });
            // removeItemFromArray(me.contacts, contact.$key);
            // this.autoScale = true;
            // this.locationsService.updateByKey(me.$key, { contacts: me.contacts, updated: timeStamp });
    }

    toggleContacts($event) {
        this.showContacts = !this.showContacts;
    }

}

//firebase.database().ref('locations').child('-KMcS5szYoEpMtkvrekI').child('location').update({lng: -2.7016700, lat: 51.1417600});