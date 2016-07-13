import {Geo} from './geo';
import {GoogleMap, LatLng, Marker, Url} from './googlemap';
import {ScriptLoadService} from './scriptload';
import {MockPoints} from './mock';
import {Fire} from './fire';

let fire = new Fire();
let gmap: any;

// this.db.on('child_added', function (snapshot: any) {
//     let marker = <Marker>snapshot.val();
//     let id = snapshot.key;
//     console.log(id, marker.name, marker.location, marker.color);
// });

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
            console.log(m)
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
    let centre = { lat: position.latitude, lng: position.longitude };
    gmap.show();

    let id = fire.addLocation({ name: 'Mark', location: centre, color: 'blue' });
    console.log('added', id);

    // Add mock points
    setTimeout(() => {
        MockPoints.forEach(m => {
            fire.addLocation(m);
        })
    },
        3000);
}
