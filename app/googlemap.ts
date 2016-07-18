///<reference path="../typings/window.extend.d.ts"/>
const ApiKey = 'AIzaSyD8Aabj3T6FBVOtrV9akF_1p4FeqCzM9yU';
export const Url = 'https://maps.googleapis.com/maps/api/js?key=' + ApiKey + '&libraries=geometry';

export interface LatLng {
    lat: number;
    lng: number;
}

export class Marker {
    name: string;
    location: LatLng;
    color: string;

    constructor(location: LatLng, name: string = '', color: string = 'red') {
        this.location = location;
        this.name = name;
        this.color = color;
    }
}

export class GoogleMap {
    map: any;
    options: any = {
        zoom: 12
    };
    icon: any = {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: 'white',
        fillOpacity: 0.8,
        scale: 14,
        strokeColor: 'blue',
        strokeWeight: 2
    };
    markers: any[] = [];
    bounds: any;

    constructor(options?: any) {
        if (options) { this.setOptions(options); }
        this.resetBounds();
    }

    public setOptions(options?: any) {
        this.options = Object.assign({}, this.options, options);
    }

    public show() {
        this.map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: this.options.zoom,
            center: this.options.centre
        });
    }

    public removeMarkers() {
        this.markers.forEach(m => {
            m.setMap(null);
            m = null;
        });
        this.resetBounds();
    }

    private resetBounds() {
        this.bounds = new window.google.maps.LatLngBounds();
    }

    public addMarker(marker: Marker) {
        let symbol = Object.assign({}, this.icon, { strokeColor: marker.color });
        let mapMarker = new window.google.maps.Marker({
            position: marker.location,
            map: this.map,
            icon: symbol,
            title: marker.name,
            label: marker.name
        });
        this.scaleToFitNewMarker(mapMarker);
    }

    private scaleToFitNewMarker(marker: any) {
        this.markers.push(marker);
        this.bounds.extend(marker.getPosition());
        this.map.fitBounds(this.bounds);
    }

    public distanceBetween(point1: Marker, point2: Marker): number {
        let d1 = window.google.maps.geometry.spherical.computeDistanceBetween(point1.location, point2.location),
            d2 = window.google.maps.geometry.spherical.computeDistanceBetween(point2.location, point1.location);
        return Math.min(d1, d2);
    }

    // function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    //     var R = 6371; // Radius of the earth in km
    //     var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    //     var dLon = deg2rad(lon2 - lon1);
    //     var a =
    //         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //         Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    //         Math.sin(dLon / 2) * Math.sin(dLon / 2)
    //         ;
    //     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //     var d = R * c; // Distance in km
    //     return d;
    // }

    // function deg2rad(deg) {
    //     return deg * (Math.PI / 180)
    // }

}