var user = {
    id: "",
    vibes: 0,
    data: [],
    init: function () {
        //GET ID
        if (!Cookies.get("VIBES_USER_ID")) {
            this.id = parseInt(Math.random() * 100000)
            Cookies.set("VIBES_USER_ID", this.id, {
                expires: 700000
            });
        } else {
            this.id = Cookies.get("VIBES_USER_ID");
        }
        console.log("User ID", Cookies.get("VIBES_USER_ID"));

        //GET VIBES NUM
        if (Cookies.get("VIBES_NUM_VIBES")) {
            this.vibes = Cookies.get("VIBES_NUM_VIBES");
        }
        console.log("Vibes", Cookies.get("VIBES_NUM_VIBES"));
    },

    updateVibes: function (num_of_vibes) {
        if (num_of_vibes) {
            this.vibes = num_of_vibes;
        } else {
            this.vibes++;
        }
        Cookies.set("VIBES_NUM_VIBES", this.vibes, {
            expires: 700000
        });

        console.log("vibes - ", this.vibes)

        $(".jar-img").attr("src", "img/jar-" + this.vibes + ".png")
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

    downloadAllData: function (user_id) {
        var d = new Date();
        var today = d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate();

        console.log(today);
        return firebase.database().ref('/users/' + user_id).once('value').then(function (messages) {
            var i = 0;
            messages.forEach(function (msg) {
               if (msg.val().toCompare != today) {
                   user.data[i] = msg.val();
                   i++;
               }
            });
        });
    },

    setSmilesInBox: function (user_id) {
        return firebase.database().ref('/users/' + user_id).once('value').then(function (messages) {
            if (messages.val()) {
                var l = Object.keys(messages.val()).length;
                user.updateVibes(l); 
            }
        });
    },

    uploadToFirebase: function (vibe) {
        console.log(vibe);
        var databaseRef = firebase.database().ref("users/" + user.id + "/" + vibe.timestamp).set(vibe);
    },

    init: function () {
        firebase.initializeApp(this.config);
        this.setSmilesInBox(user.id);
    }
}

user.init();
firebaseManager.init();