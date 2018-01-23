var input = document.getElementById('thought');

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
        // for box-sizing other than "content-box" use:
        // el.style.cssText = '-moz-box-sizing:content-box';
        if (input.value.length > 0) {
            input.style.cssText = 'height:' + input.scrollHeight + 'px';
        }
    }, 0);
}

function submitText() {
    var text = input.value;
    if (text.length > 0) {
        var d = new Date();
        
        var timestamp = d.getTime(); 
        var weekDay = d.getDay();
        var day = d.getDate();
        var month = d.getMonth() + 1;
        var year = d.getFullYear();

        console.log(timestamp + ":" + day + "/" + month + "/" + year);


    }
}

input.addEventListener('keydown', function (e) {
    autosize();
})

$("#upload").on("click", function (e) {
    submitText();
})

// Keypress gets the keyCode of the current character not key.
// e.g. pressing the 'A' key will result in 'a' unless 'Shift' is also held.
window.addEventListener('keypress', function (e) {
    if (!$("#thought").is(":focus")) {
        appendCharacter(e.keyCode);
    }
});

// Use Keydown to get special keys like Backspace, Enter, Esc.
window.addEventListener('keydown', function (e) {
    if (!$("#thought").is(":focus")) {
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