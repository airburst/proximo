import {Geo} from './geo';
import {GoogleMap, LatLng, Url} from './googlemap';
import {ScriptLoadService} from './scriptload';
import {MockPoints} from './mock';

window.onload = function () {
    if (!window.google) {
        let scriptLoad = new ScriptLoadService(),
            scriptPromises = [Url].map(scriptLoad.load);

        Promise.all(scriptPromises)
            .then(() => { getPosition(); }, function(value) {
                console.error('Script not found:', value)
            });
    }
}

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
    let gmap = new GoogleMap({ centre: centre });
    gmap.show();
    gmap.addMarker(centre, 'Mark', 'blue');

    // Add mock points
    MockPoints.forEach(m => {
        gmap.addMarker(m.location, m.name, m.color);
    });
}
