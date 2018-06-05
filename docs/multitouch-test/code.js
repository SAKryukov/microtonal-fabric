document.body.onload = function () {
    let turnOn = function(ev) { ev.target.style.backgroundColor = "red"; ev.preventDefault(); };
    let turnOff = function(ev) { ev.target.style.backgroundColor = "yellow"; ev.preventDefault(); };
    let div = document.querySelector("body section div");
    let boolusemouse = document.getElementById("boolusemouse");
    var current = div;
    while (current) {
        current.ontouchstart = function(ev) {
            turnOn(ev);
        };
        current.ontouchend = function(ev) {
            turnOff(ev);
        };
        current.onmousedown = function(ev) {
            if (!boolusemouse.checked) return;
            turnOn(ev);
        };
        current.onmouseup = function(ev) {
            if (!boolusemouse.checked) return;
            turnOff(ev);
        };
        current.onmouseenter = function(ev) {
            if (!boolusemouse.checked) return;
            if (ev.buttons == 1)
              turnOn(ev);
        };
        current.onmouseleave = function(ev) {
            if (!boolusemouse.checked) return;
            turnOff(ev);
        };
        current = current.nextSibling;
    } 
};
