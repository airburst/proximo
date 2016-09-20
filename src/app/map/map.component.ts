import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ILocation, Location, LatLng } from '../location';
import { GeolocationService } from '../geolocation.service';
import { timeStamp, uniqueArray, removeItemFromArray } from '../utils';
import { select } from 'ng2-redux';
import { ISettings } from '../store';
import { SettingsActions } from '../actions';

declare let google: any;

@Component({
    selector: 'app-map',
    templateUrl: 'map.component.html',
    styleUrls: ['map.component.css'],
    providers: [GeolocationService]                 //
})
export class MapComponent implements OnInit {

    @select() settings$: Observable<ISettings>;
    map: any;
    settings: ISettings;
    options: any = { zoom: 12 };
    icon: any = {
        path: google.maps.SymbolPath.CIRCLE,
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
    joinId: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private geoService: GeolocationService,
        private settingsActions: SettingsActions
    ) {
        this.markers = new Map;
    }

    ngOnInit() {
        this.resetBounds();
        this.show();
        this.settings$.subscribe((s) => {
            if (s.initialised) {
                this.settings = s;
                this.setJoinIdFromUrl();
                this.updateMap(s);
            }
        });
        //this.geoService.watch(this.updateMyLocation.bind(this));
    }

    setJoinIdFromUrl() {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.joinId = params['id'];
                if (this.joinId !== this.settings.locationId) { 
                    this.settingsActions.linkUsers(this.joinId);
                    this.router.navigate(['/'], { relativeTo: this.route });
                }
            }
        });
    }

    private resetBounds() {
        this.bounds = new google.maps.LatLngBounds();
    }

    public show() {
        if (google) {
            this.map = new google.maps.Map(document.getElementById('map'), {
                zoom: this.options.zoom,
                center: this.options.centre
            });
        }
    }

    updateMap(settings: any) {                      // Strong type?
        this.displayMarkers(settings.myPins);
    }

    private displayMarkers(markers: ILocation[]) {
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
        return new google.maps.Marker({
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
            var extendPoint1 = new google.maps.LatLng(this.bounds.getNorthEast().lat() + 0.005, this.bounds.getNorthEast().lng() + 0.005);
            var extendPoint2 = new google.maps.LatLng(this.bounds.getNorthEast().lat() - 0.005, this.bounds.getNorthEast().lng() - 0.005);
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
        this.map.panTo($event);
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
        this.settingsActions.updateLocationByKey(contact.$key, { contacts: contact.contacts, updated: timeStamp });
    }

    private unlinkContactFromMe(contact: ILocation) {
        removeItemFromArray(this.settings.myLocation.contacts, contact.$key);
        this.settingsActions.updateLocationByKey(this.settings.locationId, { contacts: this.settings.myLocation.contacts, updated: timeStamp });
    }

    toggleContacts($event) {
        this.showContacts = !this.showContacts;
    }

    updateNewUser(details: any) {
        this.settingsActions.updateLocationByKey(this.settings.locationId, { name: details.firstname, color: details.colour });
        this.settingsActions.update({ newUser: false });
    }

}
