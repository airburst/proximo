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
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'app-map',
    templateUrl: 'map.component.html',
    styleUrls: ['map.component.css'],
    directives: [ROUTER_DIRECTIVES, MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES, MD_LIST_DIRECTIVES, MdIcon, MdToolbar, ContactsComponent],
    providers: [MdIconRegistry, LocationsService, LocalstorageService, GeolocationService]
})
export class MapComponent implements OnInit {

    map: any;
    locationId: string;
    locations$: Observable<ILocation[]>;
    contacts$: Observable<ILocation[]>;
    me$: Observable<ILocation>;
    joinId: string = undefined;
    joinName: string = undefined;
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
        private geoService: GeolocationService
    ) {
        this.markers = new Map;
        this.locationId = this.localstorageService.get('proximoLocationId');
        this.setJoinIdFromUrl();
        this.locations$ = locationsService.locations$;
        this.locations$
            .delay(500)
            .subscribe((l) => {
                if (this.locationId === null) { this.locationId = this.localstorageService.get('proximoLocationId'); }
                this.filterContacts(l);
                if (this.joinId !== undefined) { this.linkUsers(this.joinId, l); }
                else { this.displayMarkers(l); }
            });
    }

    setJoinIdFromUrl() {
        this.route.params.subscribe(params => {
            if (params['id']) { this.joinId = params['id']; }
            // if (params['name']) { this.locationsService.updateByKey(this.locationId, { name: params['name'] }); }
        });
    }

    linkUsers(theirId: string, locations: ILocation[]) {
        // TODO: show modal to confirm
        locations.forEach((l) => {
            if (this.isMyLocationId(l)) { this.linkMeToThem(theirId, l); }
            if (l.$key === theirId) { this.linkThemToMe(l); }
        });
        this.joinId = undefined;
        this.router.navigate(['/'], { relativeTo: this.route });
    }

    linkMeToThem(theirId: string, myLocation: ILocation) {
        let c: string[] = [theirId];
        if (myLocation.contacts) { c = uniqueArray(c.concat(myLocation.contacts)); }
        this.locationsService.updateByKey(this.locationId, { contacts: c, updated: timeStamp });
    }

    linkThemToMe(theirLocation: ILocation) {
        let c: string[] = [this.locationId];
        if (theirLocation.contacts) { c = uniqueArray(c.concat(theirLocation.contacts)); }
        this.locationsService.updateByKey(theirLocation.$key, { contacts: c, updated: timeStamp });
    }

    ngOnInit() {
        this.me$ = this.myLocation();
        this.resetBounds();
        this.show();
        this.geoService.watch(this.updateMyLocation.bind(this));
    }

    myLocation(): Observable<ILocation> {
        return this.locations$
            .flatMap((data) => data)
            .filter(l => l.$key === this.locationId);
    }

    filterContacts(locations: ILocation[]): void {
        // Filter for locations that include me as a contact and were updated in last 24 hours
        let array = locations.filter((l) => {
            return this.isLinkedToMyLocationId(l) && this.hasUpdatedInLastDay(l);
        });
        this.contacts$ = Observable.of(array);
    }

    updateMyLocation(latLng: LatLng) {
        this.locationsService.updateByKey(this.locationId, { position: latLng, updated: timeStamp });
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

    private displayMarkers(markers: ILocation[]) {
        this.removeAllMarkers();
        markers.forEach((m) => {
            if (this.containsMyLocationId(m) && this.hasUpdatedInLastDay(m)) {
                this.addMarker(m);
            }
        });
        if (this.autoScale) { this.scaleToFit(); this.autoScale = false; }
    }

    private containsMyLocationId(location: ILocation): boolean {
        return (this.isMyLocationId(location) || this.isLinkedToMyLocationId(location)) ? true : false;
    }

    private isMyLocationId(location: ILocation): boolean {
        return (location.$key === this.locationId) ? true : false;
    }

    private isLinkedToMyLocationId(location: ILocation): boolean {
        return location.contacts && (location.contacts.indexOf(this.locationId) > -1) ? true : false;
    }

    private hasUpdatedInLastDay(location: ILocation): boolean {
        return (moment().diff(moment(location.updated), 'days') === 0);
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

    private centreMe(key: string = this.localstorageService.get('proximoLocationId')) {
        let me = this.findInMarkersList(key);
        this.map.panTo(me.position);
    }

    private scaleToFit() {
        this.resetBounds();
        this.markers.forEach((m) => { this.scaleToFitNewMarker(m); });
    }

    private addPeople($event) {
        this.router.navigate(['../invite/', this.locationId], { relativeTo: this.route });
    }

    // Unlink contact (both ways)
    private unlinkContact(contact: ILocation) {
        removeItemFromArray(contact.contacts, this.locationId);
        this.locationsService.updateByKey(contact.$key, { contacts: contact.contacts, updated: timeStamp });
        this.me$.subscribe((me) => { 
            removeItemFromArray(me.contacts, contact.$key);
            this.autoScale = true;
            this.locationsService.updateByKey(me.$key, { contacts: me.contacts, updated: timeStamp });
        });
    }

    toggleContacts($event) {
        this.showContacts = !this.showContacts;
    }

}

//firebase.database().ref('locations').child('-KMcS5szYoEpMtkvrekI').child('location').update({lng: -2.7016700, lat: 51.1417600});