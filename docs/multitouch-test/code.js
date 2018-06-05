document.body.onload = function () {
    var turnOn = function(ev) { ev.target.style.backgroundColor = "red"; ev.preventDefault(); };
    var turnOff = function(ev) { ev.target.style.backgroundColor = "yellow"; ev.preventDefault(); };
    var div = document.querySelector("body section div");
    var boolusemouse = document.getElementById("boolusemouse");
    var checkMouseOption = function (ev) { ev.preventDefault(); return boolusemouse.checked; };
    var current = div;
    while (current) {
        current.ontouchstart = function(ev) {
            turnOn(ev);
        };
        current.ontouchend = function(ev) {
            turnOff(ev);
        };
        current.onmousedown = function(ev) {
            if (!checkMouseOption(ev)) return;
            turnOn(ev);
        };
        current.onmouseup = function(ev) {
            if (!checkMouseOption(ev)) return;
            turnOff(ev);
        };
        current.onmouseenter = function(ev) {
            if (!checkMouseOption(ev)) return;
            if (ev.buttons == 1)
              turnOn(ev);
        };
        current.onmouseleave = function(ev) {
            if (!checkMouseOption(ev)) return;
            turnOff(ev);
        };
        current = current.nextSibling;
    } 
};
