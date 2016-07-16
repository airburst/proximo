import {Geo} from './geo';
import {GoogleMap, LatLng, Marker, Url} from './googlemap';
import {ScriptLoadService} from './scriptload';
import {MockPath} from './mock';
import {Fire} from './fire';
import {LocalStorage} from './storage';
import {QueryParams} from './queryparams';

class App {
    fire: any;
    store: any;
    groupId: string;
    locationId: string;
    groupPath: string;
    gmap: any;
    params: any;

    constructor() {
        this.fire = new Fire();
        this.initialiseData();
        this.loadGoogleScripts();
    }

    initialiseData() {
        this.store = new LocalStorage();
        this.setGroupFromUrl();
        this.getIds();
    }

    setGroupFromUrl() {
        this.params = new QueryParams(window.location.href).params;
        if (this.params.group) { this.store.set('groupId', this.params.group); }
        //NOTE: may want to push a collection of groupIds into store
    }

    getIds() {
        this.groupId = this.getOrSetGroupId();
        this.locationId = this.store.get('locationId');
        this.groupPath = 'groups/' + this.groupId + '/locations';
    }

    getOrSetGroupId(): string {
        let g = this.store.get('groupId');
        if (g) { return g; }
        let id = this.fire.setItem('groups', g);
        this.store.setIfEmpty('groupId', id);
        return id;
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
        this.fire.collection(this.groupPath).on('value', updateMap);
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
        let updateId = this.fire.setItem(
            this.groupPath, 
            this.locationId, 
            { name: 'Mark', location: location, color: 'blue' } //TODO: get name from form
        );
        this.store.setIfEmpty('locationId', updateId);
        //this.addMockUsers();
    }

    addMockUsers() {
        let m = new MockPath(this.groupPath);
        m.startMoving();
    }
}

const app = new App();

/*
firebase.database().ref('locations').child('-KMcS5szYoEpMtkvrekI').child('location').update({lng: -2.7016700, lat: 51.1417600});
*/