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

    setLocation(location: any) {
        this.db.push(location);
        //console.log(this.db.key());
    }

    // removeItem: function(key) {
    //     var firebaseRef = firebase.database().ref('todoApp/items');;
    //     firebaseRef.child(key).remove();
    // }

}

// var usersRef = this.db.child("users");
// usersRef.set({
//   alanisawesome: {
//     date_of_birth: "June 23, 1912",
//     full_name: "Alan Turing"
//   },
//   gracehop: {
//     date_of_birth: "December 9, 1906",
//     full_name: "Grace Hopper"
//   }
// });