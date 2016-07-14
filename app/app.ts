import {Geo} from './geo';
import {GoogleMap, LatLng, Marker, Url} from './googlemap';
import {ScriptLoadService} from './scriptload';
import {MockPoints} from './mock';
import {Fire} from './fire';
import {LocalStorage} from './storage';

let fire = new Fire(),
    store = new LocalStorage(),
    locationId = store.get('locationId'),
    gmap: any;
console.log('Existing locationId', locationId)

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
    fire.db.on('value', updateMap);
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

    let updateId = fire.setItem(locationId, {
        name: 'Mark', 
        location: location, 
        color: 'blue' 
    });
    console.log('updateId', updateId)
    store.setIfEmpty('locationId', updateId);

    // Add mock points
    // setTimeout(() => {
    //     MockPoints.forEach(m => {
    //         fire.addLocation(m);
    //     })
    // },
    //     3000);
}
