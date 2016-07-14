import * as firebase from 'firebase';
import {LocalStorage} from './storage';

export class Fire {

    public db: any;
    private config: any = {
        apiKey: "AIzaSyDGe_FmSZBr74_Eo9rbe-Ld9r264Ay47hE",
        authDomain: "proximo-55720.firebaseapp.com",
        databaseURL: "https://proximo-55720.firebaseio.com",
        storageBucket: "",
    };
    private localStore = new LocalStorage();

    constructor() {
        firebase.initializeApp(this.config);
        this.db = firebase.database();
    }

    public setItem(collection: string, id: string, value: any): any {
        if (id) {
            return this.updateItem(collection, id, value);
        } else {
            return this.addItem(collection, value);
        }
    }

    public addItem(collection: string, location: any): string {
        let ref = this.db.ref(collection).push(location);
        this.localStore.set(collection + 'Id', ref.key);
        console.log(collection + 'Id', ref.key)
        return ref.key;
    }

    public updateItem(collection: string, id: string, location: any) {
        this.db.ref(collection).child(id).update(location);
        return false;
    }

    public removeItem(collection: string, key: string) {
        this.db.ref(collection).child(key).remove();
    }

}
