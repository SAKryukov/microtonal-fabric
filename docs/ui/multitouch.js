// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2019
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard

"use strict";

function setMultiTouch(
    container,
    elementSelector, // element => bool
    elementHandler,  // (element, Touch touchObject, bool on) => undefined
    sameElementHandler, // (element, Touch touchObject) => undefined: handles move in the area of the same element
) {

    if (!container) container = document;

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

    if (!elementSelector)
        return {
            assignTouchStart: assignTouchStart,
            assignTouchMove: assignTouchMove,
            dynamicAlgorithm: (touch, volumeDivider) => { return Math.pow(touch.radiusX * touch.radiusY, 2) / volumeDivider; }};

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

    assignTouchStart(container, (ev) => {
        ev.preventDefault();
        for (let touch of ev.touches) {
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            addRemoveElement(touch, element, true);    
        } //loop
    }); //assignTouchStart
    
    assignTouchMove(container, (ev) => {
        ev.preventDefault();
        for (let touch of ev.touches) {
            let element = document.elementFromPoint(touch.clientX, touch.clientY);
            const goodElement = isGoodElement(element); 
            const touchElement = elementDictionary[touch.identifier];
            if (goodElement && touchElement) {
                if (element == touchElement) {
                    if (sameElementHandler)
                        sameElementHandler(element, touch)
                        continue;
                    } //if same
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
    
    assignTouchEnd(container, (ev) => {
        ev.preventDefault();
        for (let touch of ev.changedTouches) {
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            addRemoveElement(touch, element, false);
        } //loop
    }); //assignTouchEnd

} //setMultiTouch