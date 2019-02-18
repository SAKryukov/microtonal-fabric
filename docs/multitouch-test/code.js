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
    const elementDictionary = {};
    const addRemoveElement = (touch, element, doAdd) => {
        if (element && element.specialControlHandler) element.specialControlHandler(element, doAdd);
        if (doAdd)
            elementDictionary[touch.identifier] = element;
        else
            delete elementDictionary[touch.identifier];
    };
    const turnOn = (target) => { target.style.backgroundColor = "red"; };
    const turnOff = (target) => { target.style.backgroundColor = "yellow"; };
    const track = document.querySelector("body textarea");
    const body = document.body;
    assignTouchStart(document, (ev) => {
        const touch = ev.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        addRemoveElement(touch, element, true);
    });
    assignTouchMove(document, (ev) => {
        const touch = ev.touches[0];
        let element = document.elementFromPoint(touch.clientX, touch.clientY);
        const touchElement = elementDictionary[touch.identifier];
        //if (element == touchElement) return;
        const add = !!(element && element.specialControlHandler);
        if (add)
            addRemoveElement(touch, element, add);
        else
            addRemoveElement(touch, touchElement, add);
    });
    assignTouchEnd(document, (ev) => {
        const touch = ev.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        addRemoveElement(touch, element, false);
    });
    const container = document.querySelector("body section");
    let current = container.firstElementChild;
    while (current) {
        current.specialControlHandler = (target, on) => {
            track.textContent = target.textContent;
            if (on) turnOn(target); else turnOff(target); 
        };
        assignTouchStart(current, (ev) => {
            if (!ev.target.specialControlHandler) return;
            turnOn(ev.target);
        });
        current = current.nextElementSibling;
    } //loop
    const boolUseMouse = document.getElementById("bool-use-mouse");
    const checkMouseOption = function (ev) { ev.preventDefault(); return boolUseMouse.checked; };
};
