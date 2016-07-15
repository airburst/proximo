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
        this.db = firebase.database();
    }

    public setItem(collection: string, id: string, value: any = this.uid()): any {
        return (id) ? this.updateItem(collection, id, value) : this.addItem(collection, value);
    }

    public addItem(collection: string, value: any): string {
        let ref = this.collection(collection).push(value);
        return ref.key;
    }

    public updateItem(collection: string, id: string, value: any) {
        console.info('collection', collection, 'update id', id, 'value', value)
        this.collection(collection).child(id).update(value);
        return false;
    }

    public removeItem(collection: string, key: string) {
        this.collection(collection).child(key).remove();
    }

    public collection(collection: string): any {
        return this.db.ref(collection);
    }

    uid() {
        let r = (s?: number) => {
            let p = (Math.random().toString(16)+"000000000").substr(2,8);
            return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p;
        };
        return r() + r(1) + r(1) + r();
    }
}
