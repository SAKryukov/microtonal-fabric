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
    const hiddenElementPropertyName = ""; //SA???
    const isGoodElement = element => element && element[hiddenElementPropertyName]; 
    const elementDictionary = {};
    const elementHandler = (target, on) => { if (on) turnOn(target); else turnOff(target); };
    const addRemoveElement = (touch, element, doAdd) => {
        if (isGoodElement(element))
            elementHandler(element, doAdd);
        if (doAdd)
            elementDictionary[touch.identifier] = element;
        else
            delete elementDictionary[touch.identifier];
    }; //addRemoveElement
    const turnOn = (target) => { target.style.backgroundColor = "red"; };
    const turnOff = (target) => { target.style.backgroundColor = "yellow"; };
    const track = document.querySelector("body textarea");
    const body = document.body;
    assignTouchStart(document, (ev) => {
        for (let touch of ev.touches) {
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            addRemoveElement(touch, element, true);    
        } //loop
    }); //assignTouchStart
    assignTouchMove(document, (ev) => {
        for (let touch of ev.touches) {
            let element = document.elementFromPoint(touch.clientX, touch.clientY);
            const goodElement = isGoodElement(element); 
            const touchElement = elementDictionary[touch.identifier];
            if (goodElement && touchElement) {
                addRemoveElement(touch, touchElement, false);            
                addRemoveElement(touch, element, true);
            } else {
                if (goodElement)
                    addRemoveElement(touch, element, goodElement);
                else
                    addRemoveElement(touch, touchElement, goodElement);
            } //if    
        } //loop
    }); //assignTouchMove
    assignTouchEnd(document, (ev) => {
        for (let touch of ev.changedTouches) {
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            addRemoveElement(touch, element, false);
        } //loop
    }); //assignTouchEnd
    const container = document.querySelector("body section");
    let current = container.firstElementChild;
    while (current) {
        current[hiddenElementPropertyName] = true;
        current = current.nextElementSibling;
    } //loop
    const boolUseMouse = document.getElementById("bool-use-mouse");
    const checkMouseOption = function (ev) { ev.preventDefault(); return boolUseMouse.checked; };
};
