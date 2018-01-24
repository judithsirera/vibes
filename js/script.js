var daysInAWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var monthsInYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var curiousity = [
    "Forcing yourself to smile can boost your mood",
    "Smiling can improve your immune system",
    "Smiles and positivity are contagious",
    "Smiling releases neuropeptides that help to fight the stress",
    "It's easier to smile than to frown",
    "Smiles use from 5 to 53 facial muscles",
    "Babies are born with the ability to smile",
    "Smiles can be recognized from 300feet away",
    "There are 19 different types of smiles",
    "If you smile, your neighboors have 34% increased change of becoming happy",
    "If you are smiling you look more attractive and intelligent",
    "When you smile, a friend living 1mile can be 25% more happy",
    "Happiness can make you live longer and improve your heart healthiness",
    "The hippocampus area of your brain is responsable of happiness",
    "Happiness is maximized at 13.9ºC or 57ºF",
    "Sleep-deprived people only remembers around 31% of possitive words",
    "A sense of community and celebrations contribute to happiness",
    "Thinking positive will make trials easier to bear",
    "When you were born, you were, for a moment, the youngest person on earth",
    "Cows have best friends and they tend to spend most of their time together",
    "Blind people smile even though they’ve never seen anyone else smile",
    "The Beatles used the word “love” 613 times in their songs",
    "Macaques in Japan use coins to buy vending machine snacks",
    "Kissing burns 2 calories a minute",
    "The animal Quokka, in Australia, is considered the world’s happiest animal",


]

/**
 * COLLECT BTN
 * - SetSmiles
 * - Animate
 * - init
 */
var collectBtn = {
    btn: null,

    setSmiles: function () {
        if (user.vibes < 5) {
            this.btn.attr("src", "img/jar-" + user.vibes + ".png");
        } else {
            this.btn.attr("src", "img/jar-5.png");
        }
    },

    animate: function () {
        $(this.btn).addClass("animate");
        this.setSmiles();
    },

    init: function () {

        this.btn = $(".jar-img");
        $(this.btn).on("animationend", function (e) {
            $(".jar-img").removeClass("animate");
        });

        $("#upload").on("click", goodVibes.submitVibe);

    }
}

/**
 * GOODVIBES
 * - SetNewVibe
 * - Encrypt
 * - Decrypt
 */
var goodVibes = {
    vibe: null,
    input: null,

    submitVibe: function () {
        var text = goodVibes.input.val();
        if (text.length > 0) {
            var d = new Date();

            goodVibes.setNewVibe(d, text);

            firebaseManager.uploadToFirebase(goodVibes.vibe);
            user.newVibe();

            collectBtn.animate();
            goodVibes.input.val("");
            goodVibes.showFeedBack();
        }
    },

    setNewVibe: function (d, text) {
        this.vibe = {
            timestamp: d.getTime(),
            weekDay: daysInAWeek[d.getDay()],
            day: d.getDate(),
            month: d.getMonth() + 1,
            monthName: monthsInYear[d.getMonth()],
            year: d.getFullYear(),
            text: this.encrypt(text),
            toCompare: d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate()
        }



    },

    encrypt: function (textToEncrypt) {
        var e = CryptoJS.AES.encrypt(textToEncrypt, user.id);
        return e.toString();
    },

    decrypt: function (textToDecrypt) {
        d = CryptoJS.AES.decrypt(textToDecrypt.toString(), user.id);
        return d.toString(CryptoJS.enc.Utf8);
    },

    showFeedBack: function () {

        this.input.addClass("hide");
        $("#tbt").attr("class", "show");

        $("#upload").off("click", goodVibes.submitVibe).on("click", goodVibes.hideFeedback);

        if (user.data.length > 0) {
            //show old vibe
            var idx = Math.floor(Math.random(user.data.length * 10, 0));
            $("#tbt-title").html("Do you remember?");
            $("#tbt-date").html(user.data[idx].weekDay + ", " + user.data[idx].monthName + " " + user.data[idx].day + " of " + user.data[idx].year);
            $("#tbt-text").html(decrypt(user.data[idx].text));

        } else {
            //show curiousity
            var idx = Math.floor(Math.random(curiousity.length * 10, 0));
            $("#tbt-title").html("Did you know");
            $("#tbt-text").html(curiousity[idx] + "?");
        }
    },

    hideFeedback: function () {
        $("#vibe").attr("class", "center-align");
        $("#tbt").attr("class", "hide");
        $("#upload").on("click", goodVibes.submitVibe);
    },

    init: function () {
        this.input = $("#vibe");
    }
}


/**
 * keyboard
 * - appendCharacter
 * - autosize
 * - init
 */
var keyboard = {
    appendCharacter: function (c) {
        switch (c) {
            case 8: // Backspace
                goodVibes.input.val(goodVibes.input.val().slice(0, -1));
                break;
            default:
                goodVibes.input.val(goodVibes.input.val() + String.fromCharCode(c));
        }
    },

    autosize: function () {
        setTimeout(function () {
            goodVibes.input.css("height", "100px").css("padding", "0");
            if (goodVibes.input.val().length > 0) {
                goodVibes.input.css("height", goodVibes.input.scrollHeight + "px");
            }
        }, 0);
    },

    keydownEvent: function (e) {
        if (!$(goodVibes.input).is(":focus")) {
            switch (e.keyCode) {
                case 8: // Backspace
                    e.preventDefault(); // Stops the backspace key from acting like the back button.
                    keyboard.appendCharacter(e.keyCode);
                    break;
                case 13:
                    e.preventDefault();
                    goodVibes.submitVibe();
                    break;
            }
        }
    },

    keypressEvent: function (e) {
        if (!$(goodVibes.input).is(":focus")) {
            keyboard.appendCharacter(e.keyCode);
        }
    },

    init: function () {
        $(goodVibes.input).on("keydown", function (e) {
            keyboard.autosize();
        })
        $(window).on('keydown', this.keydownEvent);
        $(window).on('keypress', this.keypressEvent);

    }
}