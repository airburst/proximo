import {Geo} from './geo';
import {GoogleMap, LatLng, Marker, Url} from './googlemap';
import {ScriptLoadService} from './scriptload';
import {MockPath} from './mock';
import {Fire} from './fire';
import {LocalStorage} from './storage';

class App {
    fire: any;
    store: any;
    locationId: string;
    gmap: any;

    constructor() {
        this.fire = new Fire();
        this.store = new LocalStorage();
        this.locationId = this.store.get('locationId');
        this.loadGoogleMaps();
    }

    loadGoogleMaps() {
        if (!window.google) {
            let scriptLoad = new ScriptLoadService(),
                scriptPromises = [Url].map(scriptLoad.load);

            Promise.all(scriptPromises)
                .then(() => {
                    this.loadMap();
                    this.getPosition();
                }, function (value) {
                    console.error('Script not found:', value)
                });
        }
    }

    loadMap() {
        this.gmap = new GoogleMap();
        let updateMap = (snapshot: any) => {
            this.gmap.removeMarkers();
            snapshot.forEach((s: any) => {
                let m = <Marker>s.val();
                this.gmap.addMarker(m);
            });
        };
        this.fire.db.ref('locations').on('value', updateMap);
    };

    getPosition() {
        let geo = new Geo();
        if (geo.isSupported) {
            geo.getLocation()
                .then((position: any) => { this.showMap(position); })
                .catch((error: any) => { console.log('Error getting location: ' + error.message); });
        }
    }

    showMap(position: any) {
        let location = { lat: position.latitude, lng: position.longitude };
        this.gmap.show();

        let updateId = this.fire.setItem('locations', this.locationId, { name: 'Mark', location: location, color: 'blue' });
        this.store.setIfEmpty('locationId', updateId);
        this.mock();
    }

    mock() {
        let m = new MockPath();
        m.startMoving();
    }
}

const app = new App();

/*
firebase.database().ref('locations').child('-KMcS5szYoEpMtkvrekI').child('location').update({lng: -2.7016700, lat: 51.1417600});
*/