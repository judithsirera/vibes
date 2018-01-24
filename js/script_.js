
var daysInAWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var monthsInYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


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
            var timestamp_ = d.getTime();

            goodVibes.setNewVibe(d, text);
            
            firebaseManager.uploadToFirebase(this.vibe);
            user.newVibe();

            collectBtn.animate();
            goodVibes.input.val("");
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
