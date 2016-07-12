///<reference path="../typings/window.extend.d.ts"/>
const ApiKey = 'AIzaSyD8Aabj3T6FBVOtrV9akF_1p4FeqCzM9yU';
export const Url = 'https://maps.googleapis.com/maps/api/js?key=' + ApiKey + '&libraries=geometry';

export interface LatLng {
    lat: number;
    lng: number;
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
    bounds: any = new window.google.maps.LatLngBounds();

    constructor(options?: any) {
        if (options) { this.setOptions(options); }
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

    public addMarker(point: LatLng, title: string = '', color: string = 'red') {
        let symbol = Object.assign({}, this.icon, { strokeColor: color });
        let marker = new window.google.maps.Marker({
            position: point,
            map: this.map,
            icon: symbol,
            title: title,
            label: title
        });
        this.scaleToFitMarkers(marker);
    }

    private scaleToFitMarkers(marker: any) {
        this.markers.push(marker);
        this.bounds.extend(marker.getPosition());
        this.map.fitBounds(this.bounds);
    }

}