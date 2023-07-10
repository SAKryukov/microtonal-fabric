// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

const setMultiTouch = (
    container,
    elementSelector, // element => bool
    elementHandler,  // (element, Touch touchObject, bool on, TouchEvent touchEvent) => undefined
    sameElementHandler, // (element, Touch touchObject, TouchEvent touchEvent) => undefined: handles move in the area of the same element
) => {

    if (!elementSelector)
        return;
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

    const isGoodElement = element => element && elementSelector(element); 
    const elementDictionary = {};
    
    const addRemoveElement = (touch, element, doAdd, event) => {
        if (isGoodElement(element) && elementHandler)
            elementHandler(element, touch, doAdd, event);
        if (doAdd)
            elementDictionary[touch.identifier] = element;
        else
            delete elementDictionary[touch.identifier];
    }; //addRemoveElement

    assignTouchStart(container, ev => {
        ev.preventDefault();
        if (ev.changedTouches.length < 1) return;
        const touch = ev.changedTouches[ev.changedTouches.length - 1];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        addRemoveElement(touch, element, true, ev);    
    }); //assignTouchStart
    
    assignTouchMove(container, ev => {
        ev.preventDefault();
        for (let touch of ev.touches) {
            let element = document.elementFromPoint(touch.clientX, touch.clientY);
            const goodElement = isGoodElement(element); 
            const touchElement = elementDictionary[touch.identifier];
            if (goodElement && touchElement) {
                if (element == touchElement) {
                    if (sameElementHandler)
                        sameElementHandler(element, touch, ev)
                        continue;
                    } //if same
                addRemoveElement(touch, touchElement, false, ev);            
                addRemoveElement(touch, element, truem, ev);
            } else {
                if (goodElement)
                    addRemoveElement(touch, element, goodElement, ev);
                else
                    addRemoveElement(touch, touchElement, goodElement, ev);
            } //if    
        } //loop
    }); //assignTouchMove
    
    assignTouchEnd(container, ev => {
        ev.preventDefault();
        for (let touch of ev.changedTouches) {
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            addRemoveElement(touch, element, false, ev);
        } //loop
    }); //assignTouchEnd

}; //setMultiTouch
