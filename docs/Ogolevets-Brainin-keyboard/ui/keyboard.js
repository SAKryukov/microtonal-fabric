"use strict";

const keyboardMode = { normal: 0, chord: 1, chordSet: 2, chordSetTonic: 6 };

class Keyboard {

    #implementation = { mode: 0, chord: [] };

    constructor(keyboard, options, defaultChord) { //options: definitionSet.keyboardOptions
        const keyList = keyboard.firstElementChild.children;
        this.#implementation.setVisibility = on => {
            keyboard.style.display = on ? "block" : "none";
        }; //this.#implementation.setVisibility
        const keyMap = new Map();
        const handleElement = (element, on) => {
            const elementData = keyMap.get(element);
            if (this.#implementation.keyHandler)
                this.#implementation.keyHandler(elementData.index, on);
            element.style.fill = on ? options.highlightColor : elementData.originalColor;

        }; //handleElement
        const handler = (element, on) => {
            if (this.#implementation.mode == keyboardMode.chord && this.#implementation.chord.length > 0) {
                const elementData = keyMap.get(element);
                const delta = elementData.index - this.#implementation.chord[0];
                for (let chordIndex of this.#implementation.chord) {
                    const shiftedChordIndex = chordIndex + delta;
                    if (shiftedChordIndex < 0 || shiftedChordIndex >= this.#implementation.keyList.length) continue;
                    const chordElement = this.#implementation.keyList[shiftedChordIndex];
                    handleElement(chordElement, on);
                } //loop
            } else if (this.#implementation.mode == keyboardMode.normal)
                handleElement(element, on);
        }; //handler
        setMultiTouch(
            keyboard,
            element => element.constructor == SVGRectElement,
            (element, _, on) => { handler(element, on); });
        const keys = Array.prototype.slice.call(keyList);
        this.#implementation.keyList = keys;
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
        let index = 0;
        for (let key of keys) {
            const inDefaultChord = defaultChord.includes(index);
            const isChordTonic = index == defaultChord[0];
            if (inDefaultChord) this.#implementation.chord.push(index);
            keyMap.set(key, {
                index: index, originalColor: key.style.fill,
                inChord: inDefaultChord, isChordTonic: isChordTonic });
            key.onmousedown = event => handler(event.target, true);
            key.onmouseup = event => handler(event.target, false);
            key.onmouseenter = event => { if (event.buttons == 1) handler(event.target, true); }
            key.onmouseleave = event => { if (event.buttons == 1) handler(event.target, false); }
            ++index;
        } //loop
        this.#implementation.getFirst = _ => { return 0; }
        this.#implementation.getLast = _ => { return keys.length - 1; }
        this.#implementation.setMode = mode => {
            this.#implementation.mode = mode;
            for (let keyIndex of this.#implementation.chord) {
                const chordKey = this.#implementation.keyList[keyIndex];
                const chordKeyData = keyMap.get(chordKey);
                chordKey.style.fill = mode & keyboardMode.chordSet ?
                    (chordKeyData.isChordTonic ? options.chordTonicColor : options.chordColor)
                    :
                    chordKeyData.originalColor;
            } //loop
        }; //this.#implementation.setMode
    } //constructor

    set keyHandler(aHandler) { this.#implementation.keyHandler = aHandler; }
    
    get first() { return this.#implementation.getFirst(); }
    get last() { return this.#implementation.getLast(); }
    
    hide() { this.#implementation.setVisibility(false); }
    show() { this.#implementation.setVisibility(true); }

    set mode(value) { this.#implementation.setMode(value); }
    get mode() { return this.#implementation.mode; }

} //class Keyboard
