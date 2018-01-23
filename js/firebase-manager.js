// Initialize Firebase
var config = {
    apiKey: "AIzaSyBQKyTdcw6sT3qcavOHluVM3Akcg3rIz7s",
    authDomain: "vibes-d62e9.firebaseapp.com",
    databaseURL: "https://vibes-d62e9.firebaseio.com",
    projectId: "vibes-d62e9",
    storageBucket: "vibes-d62e9.appspot.com",
    messagingSenderId: "1019159236803"
};


var user = {
    id: "",
    init: function () {
        if (!Cookies.get("VIBES_USER_ID")) {
            this.id = parseInt(Math.random() * 100000)
            Cookies.set("VIBES_USER_ID", this.id, {
                expires: 700000
            });
        } else {
            this.id = Cookies.get("VIBES_USER_ID");
        }
        console.log("Foodalite UserID", Cookies.get("VIBES_USER_ID"));
    }
}


function uploadToFirebase(vibe) {
    console.log(vibe);
    var databaseRef = firebase.database().ref();
    databaseRef.child(user.id).push(vibe).then(function () {
        console.log("uploaded");
    });
    //databaseRef.child(object.timestamp);
}

firebase.initializeApp(config);
user.init();