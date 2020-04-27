"use strict";

class Keyboard {

    #implementation = {};

    constructor(keyboard) {
        const keyList = keyboard.firstElementChild.children;
        this.#implementation.setVisibility = on => {
            keyboard.style.display = on ? "block" : "none";
        }; //this.#implementation.setVisibility
        const keyMap = new Map();
        const handler = (element, on) => {
            const elementData = keyMap.get(element);
            if (this.#implementation.keyHandler)
                this.#implementation.keyHandler(elementData.index, on);
            element.style.fill = on ? "Chartreuse" : elementData.originalColor;
        }; //handler
        setMultiTouch(
            keyboard,
            element => element.constructor == SVGRectElement,
            (element, _, on) => { handler(element, on); });
        const keys = Array.prototype.slice.call(keyList);
        keys.sort((a, b) => {
            if (b.x.baseVal.value == a.x.baseVal.value && b.y.baseVal.value == a.y.baseVal.value)
                return 0;
            else if (b.x.baseVal.value == a.x.baseVal.value) {
                if (b.y.baseVal.value > a.y.baseVal.value)
                    return 1;
                else
                    return -1;
            } else if (b.x.baseVal.value > a.x.baseVal.value)
                return -1;
            else
                return 1;
        });
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
        let index = 0;
        for (let key of keys) {
            keyMap.set(key, { index: index, originalColor: key.style.fill });
            key.onmousedown = event => handler(event.target, true);
            key.onmouseup = event => handler(event.target, false);
            key.onmouseenter = event => { if (event.buttons == 1) handler(event.target, true); }
            key.onmouseleave = event => { if (event.buttons == 1) handler(event.target, false); }
            ++index;
        } //loop
        this.#implementation.getFirst = _ => { return 0; }
        this.#implementation.getLast = _ => { return keys.length - 1; }
    } //constructor

    set keyHandler(aHandler) { this.#implementation.keyHandler = aHandler; }
    
    get first() { return this.#implementation.getFirst(); }
    get last() { return this.#implementation.getLast(); }
    
    hide() { this.#implementation.setVisibility(false); }
    show() { this.#implementation.setVisibility(true); }

} //class Keyboard
