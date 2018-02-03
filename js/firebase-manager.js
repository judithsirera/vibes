/**
 * USER
 * - CheckUser
 * - SetUser
 * - SwitchUser
 */
var user = {
    id: "",
    vibes: 0,
    data: [],
    allData: [],

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
    },

    switchUser: function () {
        if (Cookies.get("VIBES_USER_ID")) {
            Cookies.remove("VIBES_USER_ID")
        }
        location.reload();
    },

    newVibe: function () {
        this.vibes++;
    },

    login: function (e) {
        var username = $('#user_name').val().toUpperCase();
        var color = $('#user_color').val().toUpperCase();

        if (username.length > 0 && color.length > 0) {
            firebaseManager.loginUserInDB(username, color);
        } else {
            user.displayError("Complete all fields")
        }
    },

    register: function (e) {
        var username = $('#user_name').val().toUpperCase();
        var color = $('#user_color').val().toUpperCase();

        if (username.length > 0 && color.length > 0) {
            firebaseManager.registerUserInDB(username, color);
        } else {
            user.displayError("Complete all fields")
        }
    },

    successLogin: function (username) {
        user.setUser(username);

        $("#login").remove();
        $(".center-box").css("z-index", "1");

        collectBtn.init();
        firebaseManager.initData(this.id);
        keyboard.init();
    },

    displayError: function (message) {
        $("#login-error").css("visibility", "visible").html(message);
    },

    init: function () {
        $("#switchBtn").on("click", this.switchUser);
        $(".historyBtn").on("click", function (e) {
            goodVibes.last = $(e.currentTarget).attr("data-type")
            goodVibes.showHistory()
        })
        $("#closeBtn").on("click", goodVibes.hideHistory)

        // User exist
        if (this.checkUser()) {
            user.successLogin(this.id);
        } else {
            $("#login").css("display", "block");
            $("#enter").on("click", this.login);
            $("#register").on("click", this.register)
        }
    }
}

/**
 * FIREBASE MANAGER
 * - SetupData
 * - UploadToFirebase
 * - Init
 */
var firebaseManager = {
    config: {
        apiKey: "AIzaSyBQKyTdcw6sT3qcavOHluVM3Akcg3rIz7s",
        authDomain: "vibes-d62e9.firebaseapp.com",
        databaseURL: "https://vibes-d62e9.firebaseio.com",
        projectId: "vibes-d62e9",
        storageBucket: "vibes-d62e9.appspot.com",
        messagingSenderId: "1019159236803"
    },

    initData: function (user_id) {
        var d = (new Date()).addDays(-7);
        var weekAgo = d.getTime()

        return firebase.database().ref('/users/' + user_id + "/vibes/").once('value').then(function (messages) {
            if (messages.val()) {
                //GET NUM OF VIBES ALREADY UPLOADED
                user.vibes = Object.keys(messages.val()).length;
                collectBtn.setSmiles();

                //GET VIBES FROM MONTH AGO
                var i = 0;
                messages.forEach(function (msg) {
                    user.allData.push(msg.val())
                    if (msg.val().timestamp <= weekAgo) {
                        user.data[i] = msg.val();
                        i++;
                    }   
                });
            }
        });
    },

    registerUserInDB: function (user_id, color) {
        firebase.database().ref('/users/' + user_id).once('value').then(function (u) {
            //Register
            if (u.val() == null) {
                var password = {
                    "password": goodVibes.encrypt(color),
                    "vibes": ""
                };
                var databaseRef = firebase.database().ref("users/" + user_id).set(password);
                user.successLogin(user_id);
            //User
            } else {
                user.displayError("This user already exists")
            }
        })

        
    },

    loginUserInDB: function (user_id, color) {
        firebase.database().ref('/users/' + user_id).once('value').then(function (u) { 
            if (u.val() == null) {
                user.displayError("No existing user");
            } else if (goodVibes.decrypt(u.val().password) != color) {
                user.displayError("Wrong password");
            } else {
                user.successLogin(user_id);
            }
        })
    },

    uploadToFirebase: function (vibe) {
        user.allData.push(vibe)
        var databaseRef = firebase.database().ref("/users/" + user.id + "/vibes/" + vibe.timestamp).set(vibe);
    },

    init: function () {
        firebase.initializeApp(this.config);
    }
}