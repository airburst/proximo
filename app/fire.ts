import * as firebase from 'firebase';

export class Fire {

    public db: any;
    private config: any = {
        apiKey: "AIzaSyDGe_FmSZBr74_Eo9rbe-Ld9r264Ay47hE",
        authDomain: "proximo-55720.firebaseapp.com",
        databaseURL: "https://proximo-55720.firebaseio.com",
        storageBucket: "",
    };

    constructor() {
        firebase.initializeApp(this.config);
        this.db = firebase.database().ref('locations');
    }

    setItem(id: string, value: any): any {
        if (id) {
            console.log('Updating', id);
            return this.updateLocation(id, value);
        } else {
            console.log('Adding', id);
            return this.addLocation(value);
        }
    }

    addLocation(location: any): string {
        let ref = this.db.push(location);
        return ref.key;
    }

    updateLocation(id: string, location: any) {
        this.db.child(id).update(location);
        return false;
    }

    removeLocation(key: string) {
        this.db.child(key).remove();
    }

}
