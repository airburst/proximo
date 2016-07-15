import {Geo} from './geo';
import {GoogleMap, LatLng, Marker, Url} from './googlemap';
import {ScriptLoadService} from './scriptload';
import {MockPath} from './mock';
import {Fire} from './fire';
import {LocalStorage} from './storage';

class App {
    fire: any;
    store: any;
    groupId: string;
    locationId: string;
    gmap: any;

    constructor() {
        this.fire = new Fire();
        this.store = new LocalStorage();
        this.getIds();
        this.loadGoogleScripts();
    }

    getIds() {
        this.groupId = this.getOrSetGroupId();
        console.log('groupId', this.groupId)
        this.locationId = this.store.get('locationId');
    }

    getOrSetGroupId(): string {
        let g = this.store.get('groupId');
        if (g) {
            return g; 
        } else {
            let id = this.fire.setItem('groups', g);
            this.store.setIfEmpty('groupId', id);
            return id;
        }
    }

    loadGoogleScripts() {
        if (!window.google) {
            let scriptLoad = new ScriptLoadService(),
                scriptPromises = [Url].map(scriptLoad.load);

            Promise.all(scriptPromises)
                .then(() => {
                    this.initialiseMap();
                    this.getPosition();
                }, function (value) {
                    console.error('Script not found:', value)
                });
        }
    }

    initialiseMap() {
        this.gmap = new GoogleMap();

        // Update markers and fit map when firebase data changes
        let updateMap = (snapshot: any) => {
            this.gmap.removeMarkers();
            snapshot.forEach((s: any) => {
                let m = <Marker>s.val();
                this.gmap.addMarker(m);
            });
        };
        this.fire.collection('locations').on('value', updateMap);
    };

    getPosition() {
        let geo = new Geo();
        geo.getLocation()
            .then((position: any) => { this.displayMap(position); })
            .catch((error: any) => { console.log('Error getting location: ' + error.message); });
    }

    displayMap(position: any) {
        let location = { lat: position.latitude, lng: position.longitude };
        this.gmap.show();

        let updateId = this.fire.setItem('locations', this.locationId, { name: 'Mark', location: location, color: 'blue' });
        this.store.setIfEmpty('locationId', updateId);
        //this.mock();
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