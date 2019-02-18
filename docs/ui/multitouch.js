function setMultiTouch(
    elementSelector, // element => bool
    elementHandler,  // (element, Touch touchObject, bool on) => undefined
) {

    const assignEvent = (element, name, handler) => {
        element.addEventListener(name, handler, { passive: false, capture: true });
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

    const isGoodElement = element => element && elementSelector(element); 
    const elementDictionary = {};
    
    const addRemoveElement = (touch, element, doAdd) => {
        if (isGoodElement(element) && elementHandler)
            elementHandler(element, touch, doAdd);
        if (doAdd)
            elementDictionary[touch.identifier] = element;
        else
            delete elementDictionary[touch.identifier];
    }; //addRemoveElement

    assignTouchStart(document, (ev) => {
        ev.preventDefault();
        for (let touch of ev.touches) {
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            addRemoveElement(touch, element, true);    
        } //loop
    }); //assignTouchStart
    
    assignTouchMove(document, (ev) => {
        ev.preventDefault();
        for (let touch of ev.touches) {
            let element = document.elementFromPoint(touch.clientX, touch.clientY);
            const goodElement = isGoodElement(element); 
            const touchElement = elementDictionary[touch.identifier];
            if (goodElement && touchElement) {
                if (element == touchElement)
                    continue;
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
        ev.preventDefault();
        for (let touch of ev.changedTouches) {
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            addRemoveElement(touch, element, false);
        } //loop
    }); //assignTouchEnd

} //setMultiTouch