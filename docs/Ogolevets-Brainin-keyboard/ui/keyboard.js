"use strict";

class Keyboard {

    #implementation = {};

    constructor(controls) {
        const keyMap = new Map();
        const handler = (element, on) => {
            if (this.#implementation.keyHandler)
            this.#implementation.keyHandler(keyMap.get(element), on);
            element.style.fill = on ? "Chartreuse" : "white";
        }
        const keys = controls.keyArray;
        let parseKeyNumberSlice = undefined;
        const parseKeyNumber = id => {
            if (parseKeyNumberSlice == undefined) {
                let index = 0;
                while (parseKeyNumberSlice == undefined) {
                    if (!isNaN(parseInt(id[index]))) break;
                    ++index;
                } //loop
                parseKeyNumberSlice = index;
            } //if
            return parseInt(id.slice(parseKeyNumberSlice));
        } //parseKeyNumber
        for (let key of keys) {
            const index = parseKeyNumber(key.id);
            keyMap.set(key, index);
            key.onmousedown = event => handler(event.target, true);
            key.onmouseup = event => handler(event.target, false);
            key.onmouseenter = event => { if (event.buttons == 1) handler(event.target, true); }
            key.onmouseleave = event => { if (event.buttons == 1) handler(event.target, false); }             
        } //loop
        this.#implementation.getFirst = _ => { return 0; }
        this.#implementation.getLast = _ => { return keys.length - 1; }
    } //constructor

    set keyHandler(aHandler) { this.#implementation.keyHandler = aHandler; }
    get first() { return this.#implementation.getFirst(); }
    get last() { return this.#implementation.getLast(); }

} //class Keyboard
