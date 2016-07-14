import {Geo} from './geo';
import {GoogleMap, LatLng, Marker, Url} from './googlemap';
import {ScriptLoadService} from './scriptload';
import {MockPath} from './mock';
import {Fire} from './fire';
import {LocalStorage} from './storage';

let fire = new Fire(),
    store = new LocalStorage(),
    locationId = store.get('locationId'),
    gmap: any;

window.onload = () => {
    if (!window.google) {
        let scriptLoad = new ScriptLoadService(),
            scriptPromises = [Url].map(scriptLoad.load);

        Promise.all(scriptPromises)
            .then(() => {
                loadMap();
                getPosition();
            }, function (value) {
                console.error('Script not found:', value)
            });
    }
}

let loadMap = () => {
    gmap = new GoogleMap();
    let updateMap = (snapshot: any) => {
        gmap.removeMarkers();
        snapshot.forEach((s: any) => {
            let m = <Marker>s.val();
            gmap.addMarker(m);
        });
    };
    fire.db.ref('locations').on('value', updateMap);
};

let getPosition = () => {
    let geo = new Geo();
    if (geo.isSupported) {
        geo.getLocation()
            .then((position: any) => { showMap(position); })
            .catch((error: any) => { console.log('Error getting location: ' + error.message); });
    }
}

let showMap = (position: any) => {
    let location = { lat: position.latitude, lng: position.longitude };
    gmap.show();

    let updateId = fire.setItem('locations', locationId, { name: 'Mark', location: location, color: 'blue' });
    store.setIfEmpty('locationId', updateId);
    mock();
}

let mock = () => {
    let m = new MockPath();
    m.startMoving();
}


/*
firebase.database().ref('locations').child('-KMcS5szYoEpMtkvrekI').child('location').update({lng: -2.7016700, lat: 51.1417600});
*/