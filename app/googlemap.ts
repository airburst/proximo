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

}