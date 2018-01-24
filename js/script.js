var daysInAWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var monthsInYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var input = document.getElementById('vibe');

function appendCharacter(c) {
    switch (c) {
        case 8: // Backspace
            input.value = input.value.slice(0, -1);
            break;
        default:
            input.value = input.value + String.fromCharCode(c);
    }
    autosize();
}

function autosize() {
    setTimeout(function () {
        input.style.cssText = 'height:100px; padding:0';
        if (input.value.length > 0) {
            input.style.cssText = 'height:' + input.scrollHeight + 'px';
        }
    }, 0);
}

function animateBox() {
    $(".jar-img").addClass("animate");
    updateSmilesInBox();
}

function updateSmilesInBox() {
    if (user.vibes < 5) {
        $(".jar-img").attr("src", "img/jar-" + user.vibes + ".png")
    } else {
        $(".jar-img").attr("src", "img/jar-5.png")
    }
}

function showVibe() {
    input.value = '';
    if (user.data.length > 0) {
        $("#vibe").addClass("hide");
        $("#tbt").attr("class", "show");

        var idx = Math.floor(Math.random(user.data.length * 10, 0));
        $("#tbt-date").html(user.data[idx].weekDay + ", " + user.data[idx].monthName + " " + user.data[idx].day + " of " + user.data[idx].year);
        $("#tbt-text").html(user.data[idx].text);

        $("#upload").off("click", submitText).on("click", hideVibe);
    }
}

function hideVibe() {
    $("#vibe").attr("class", "center-align");
    $("#tbt").attr("class", "hide");
    $("#upload").on("click", submitText)
}

function submitText() {
    console.log("hello");


    var text = input.value;
    if (text.length > 0) {
        var d = new Date();
        var timestamp_ = d.getTime();

        vibe = {
            timestamp: d.getTime(),
            weekDay: daysInAWeek[d.getDay()],
            day: d.getDate(),
            month: d.getMonth() + 1,
            monthName: monthsInYear[d.getMonth()],
            year: d.getFullYear(),
            text: text,
            toCompare: d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate()
        }

        firebaseManager.uploadToFirebase(vibe);
        user.vibes++;


        animateBox();
        showVibe();
    }
}

function start() {
    firebaseManager.init();

    input.addEventListener('keydown', function (e) {
        autosize();
    })

    $("#upload").on("click touchstart", submitText)

    document.getElementById("jar-img").addEventListener("animationend", function (e) {
        $(".jar-img").removeClass("animate");
    })


    // Keypress gets the keyCode of the current character not key.
    // e.g. pressing the 'A' key will result in 'a' unless 'Shift' is also held.
    window.addEventListener('keypress', function (e) {
        if (!$("#vibe").is(":focus")) {
            appendCharacter(e.keyCode);
        }
    });

    // Use Keydown to get special keys like Backspace, Enter, Esc.
    window.addEventListener('keydown', function (e) {
        if (!$("#vibe").is(":focus")) {
            switch (e.keyCode) {
                case 8: // Backspace
                    e.preventDefault(); // Stops the backspace key from acting like the back button.
                    appendCharacter(e.keyCode);
                    break;
                case 13:
                    e.preventDefault();
                    submitText();
                    break;
            }
        }

    });
}


var welcome = {
    init: function () {
        if (!user.checkUser()) {
            this.addWelcomeEvents();
        }
        $("#welcome").remove();
        start();
    },

    addWelcomeEvents: function() {
        $('#start').on('click', function (e) {
            var username = $('#user_name').val();
            if (username.length > 0) {
                user.setUser(username); 
            }
        })
    },

}