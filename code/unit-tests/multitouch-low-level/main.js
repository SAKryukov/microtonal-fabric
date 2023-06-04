// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2023
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

window.onload = () => {

    const elements = {
        keyboard: document.querySelector("body > div"),
        keys: [ document.querySelector("body > div > b:first-of-type"), document.querySelector("body > div > b:last-of-type") ],
        buttonClear: document.querySelector("button"),
        output: document.querySelector("select"),
    };

    const writeLine = text => {
        const option = document.createElement("option");
        option.textContent = text;
        elements.output.appendChild(option);
    };
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
    const assignTouchCancel = (element, handler) => {
        assignEvent(element, "touchcancel", handler);
    };

    for (let element of elements.keys) {
        assignTouchStart(element, ()=> writeLine("start"));
        assignTouchEnd(element, ()=> writeLine("end"));
        assignTouchCancel(element, ()=> writeLine("cancel"));
        assignTouchMove(element, ()=> writeLine("move"));    
    } //loop

    elements.buttonClear.onclick = () => {
        while(elements.output.children.length > 0)
            elements.output.removeChild(elements.output.lastChild);
    };
    
} //window.onload
