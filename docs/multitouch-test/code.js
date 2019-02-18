const assignEvent = (element, name, handler) => {
    element.addEventListener(name, handler);
};
const assignTouchStart = (element, handler) => {
    assignEvent(element, "touchstart", handler);
};
const assignTouchMove = (element, handler) => {
    assignEvent(element, "touchmove", handler);
};
const assignTouchEnd = (element, handler) => {
    assignEvent(element, "touchend", handler);
};


document.body.onload = function () {
    const turnOn = (target) => { target.style.backgroundColor = "red"; };
    const turnOff = (target) => { target.style.backgroundColor = "yellow"; };
    const track = document.querySelector("body textarea");
    const body = document.body;
    assignTouchStart(document, (ev) => {
        const touch = ev.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if ((!element) || (!element.specialControlHandler)) { track.textContent = null; return; }
        element.specialControlHandler(element, true);
    });
    assignTouchMove(document, (ev) => {
        const touch = ev.touches[0];
        if (touch.SpecialProperty)
            document.title = touch.SpecialProperty;
        touch.SpecialProperty = 1313;
        if (ev.changedTouches) {
            const changed = ev.touches[0];
            const element = document.elementFromPoint(changed.clientX, changed.clientY);
            if (element && element.specialControlHandler)
                element.specialControlHandler(element, false);
        }
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if ((!element) || (!element.specialControlHandler)) { track.textContent = null; return; }
        element.specialControlHandler(element, true);
    });
    const container = document.querySelector("body section");
    let current = container.firstElementChild;
    while (current) {
        current.specialControlHandler = (target, on) => {
            track.textContent = target.textContent;
            if (on) turnOn(target); else turnOff(target); 
        };
        assignTouchEnd(current, (ev) => {
            if (!ev.target.specialControlHandler) return;
            turnOff(ev.target);
        });
        assignTouchMove(current, (ev) => {
            if (!ev.target.specialControlHandler) return;
            const changed = ev.touches[0];
            const element = document.elementFromPoint(changed.clientX, changed.clientY);
            if (element != ev.target)
                turnOff(ev.target);
        });
        current = current.nextElementSibling;
    } //loop
    var boolUseMouse = document.getElementById("boolusemouse");
    var checkMouseOption = function (ev) { ev.preventDefault(); return boolusemouse.checked; };
};
