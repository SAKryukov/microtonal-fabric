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
        keys: [ document.querySelector("td:nth-of-type(2)"), document.querySelector("td:nth-of-type(3)") ],
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
        /*
        element.onclick = event => writeLine(`${event.target.textContent} click`);
        element.onpointerenter = event => writeLine(`${event.target.textContent} pointer enter`);
        element.onpointerleave = event => writeLine(`${event.target.textContent} pointer leave`);
        */
        assignTouchStart(element, event => writeLine(`${event.target.textContent} start`));
        assignTouchEnd(element, event => writeLine(`${event.target.textContent} end`));
        assignTouchCancel(element, event => writeLine(`${event.target.textContent} cancel`));
        assignTouchMove(element, event => writeLine(`${event.target.textContent} move`));    
    } //loop

    elements.buttonClear.onclick = () => {
        while(elements.output.children.length > 0)
            elements.output.removeChild(elements.output.lastChild);
    };
    
} //window.onload
