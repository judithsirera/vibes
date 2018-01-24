var user = {
    id: "",
    vibes: 0,
    data: [],
    // init: function () {
    //     //GET ID
    //     if (!Cookies.get("VIBES_USER_ID")) {
    //         this.id = parseInt(Math.random() * 100000)
    //         Cookies.set("VIBES_USER_ID", this.id, {
    //             expires: 700000
    //         });
    //     } else {
    //         this.id = Cookies.get("VIBES_USER_ID");
    //     }
    //     console.log("User ID", Cookies.get("VIBES_USER_ID"));

    //     // //GET VIBES NUM
    //     // if (Cookies.get("VIBES_NUM_VIBES")) {
    //     //     this.vibes = Cookies.get("VIBES_NUM_VIBES");
    //     // }
    //     // console.log("Vibes", Cookies.get("VIBES_NUM_VIBES"));
    // },

    checkUser: function () {
        if (Cookies.get("VIBES_USER_ID")) {
            this.id = Cookies.get("VIBES_USER_ID");
            return true;
        }
        return false;
    }, 

    setUser: function (newUser) {
        this.id = newUser;
        Cookies.set("VIBES_USER_ID", this.id, {
            expires: 700000
        });
    }
}


var firebaseManager = {
    config: {
        apiKey: "AIzaSyBQKyTdcw6sT3qcavOHluVM3Akcg3rIz7s",
        authDomain: "vibes-d62e9.firebaseapp.com",
        databaseURL: "https://vibes-d62e9.firebaseio.com",
        projectId: "vibes-d62e9",
        storageBucket: "vibes-d62e9.appspot.com",
        messagingSenderId: "1019159236803"
    },

    setupData: function (user_id) {
        var d = new Date();
        var today = d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate();

        return firebase.database().ref('/users/' + user_id + "/messages/").once('value').then(function (messages) {
            if (messages.val()) {
                //GET NUM OF VIBES ALREADY UPLOADED
                user.vibes = Object.keys(messages.val()).length;
                updateSmilesInBox();

                //GET VIBES FROM YESTERDAY
                var i = 0;
                messages.forEach(function (msg) {
                    if (msg.val().toCompare != today) {
                        user.data[i] = msg.val();
                        i++;
                    }
                });
            }
        });
    },

    uploadToFirebase: function (vibe) {
        var databaseRef = firebase.database().ref("users/" + user.id + "/messages/" + vibe.timestamp).set(vibe);
    },

    init: function () {
        firebase.initializeApp(this.config);
        this.setupData(user.id);
    }
}