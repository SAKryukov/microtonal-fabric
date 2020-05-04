"use strict";

const keyboardMode = { normal: 0, chord: 1, chordSet: 2, chordRootSet: 4 };

class Keyboard {

    #implementation = { mode: 0, chord: new Set(), chordRoot: -1 };

    constructor(keyboard, options, defaultChord) { //options: definitionSet.keyboardOptions

        this.#implementation.setVisibility = on => {
            keyboard.style.display = on ? "block" : "none";
        }; //this.#implementation.setVisibility
        const keyMap = new Map();

        const refreshChordColors = mode => {
            for (let keyIndex of this.#implementation.chord) {
                const chordKey = this.#implementation.keyList[keyIndex];
                const chordKeyData = keyMap.get(chordKey);
                chordKey.style.fill = mode & keyboardMode.chordSet ?
                    (chordKeyData.isChordRoot ? options.chordRootColor : options.chordColor)
                    :
                    chordKeyData.originalColor;
            } //loop
        }; //refreshChordColors

        const handleElement = (element, elementData, on) => {
            if (this.#implementation.keyHandler)
                this.#implementation.keyHandler(elementData.index, on);
            element.style.fill = on ? options.highlightColor : elementData.originalColor;
        }; //handleElement

        const handler = (element, on) => {
            const elementData = keyMap.get(element);
            if (this.#implementation.mode == keyboardMode.chord) {
                if (this.#implementation.chordRoot < 0 || this.#implementation.chord.size <= 0)
                    return handleElement(element, elementData, on);
                const delta = elementData.index - this.#implementation.chordRoot;
                for (let chordIndex of this.#implementation.chord) {
                    const shiftedChordIndex = chordIndex + delta;
                    if (shiftedChordIndex < 0 || shiftedChordIndex >= this.#implementation.keyList.length) continue;
                    const chordElement = this.#implementation.keyList[shiftedChordIndex];
                    handleElement(chordElement, keyMap.get(chordElement), on);
                } //loop
            } else if (on && this.#implementation.mode & keyboardMode.chordSet) {
                if (!on) return;
                this.#implementation.chordRoot = -1;
                if ((this.#implementation.mode & keyboardMode.chordRootSet) && elementData.chordMember) {
                    this.#implementation.chordRoot = elementData.index;
                    for (let chordIndex of this.#implementation.chord)
                        keyMap.get(this.#implementation.keyList[chordIndex]).isChordRoot = false;
                    elementData.isChordRoot = true;
                } else {
                    const chordMember = elementData.chordMember;
                    elementData.chordMember = !chordMember;
                    if (elementData.chordMember)
                        this.#implementation.chord.add(elementData.index);
                    else
                        this.#implementation.chord.delete(elementData.index);    
                } //if chord root
                element.style.fill = elementData.chordMember ?
                    (elementData.isChordRoot ? options.chordRootColor : options.chordColor)
                    :
                    elementData.originalColor;
                if (!this.#implementation.chord.has(this.#implementation.chordRoot)) {
                    this.#implementation.chordRoot = -1;
                    let first = this.#implementation.keyList.length + 1;
                    for (let chordIndex of this.#implementation.chord) {
                        if (chordIndex < first)
                            first = chordIndex;
                        keyMap.get(this.#implementation.keyList[chordIndex]).isChordRoot = false;
                    } //loop
                    if (first < this.#implementation.keyList.length) {
                        this.#implementation.chordRoot = first;
                        keyMap.get(this.#implementation.keyList[first]).isChordRoot = true;
                    } //if
                } //if
                refreshChordColors(this.#implementation.mode);
            } else if (this.#implementation.mode == keyboardMode.normal)
                handleElement(element, elementData, on);
        }; //handler

        setMultiTouch(
            keyboard,
            element => element.constructor == SVGRectElement,
            (element, _, on) => { handler(element, on); });
        const keys = Array.prototype.slice.call(keyboard.firstElementChild.children);

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
            const isChordRoot = index == defaultChord[0];
            if (isChordRoot) this.#implementation.chordRoot = index;
            if (inDefaultChord) this.#implementation.chord.add(index);
            keyMap.set(key, {
                index: index, originalColor: key.style.fill,
                chordMember: inDefaultChord, isChordRoot: isChordRoot });
            key.onmousedown = event => handler(event.target, true);
            key.onmouseup = event => handler(event.target, false);
            key.onmouseenter = event => { if (event.buttons == 1) handler(event.target, true); }
            key.onmouseleave = event => { if (event.buttons == 1) handler(event.target, false); }
            ++index;
        } //loop

        this.#implementation.getFirst = _ => { return 0; }
        this.#implementation.getLast = _ => { return keys.length - 1; }

        this.#implementation.setMode = mode => {
            const doRelease = (mode != keyboardMode.chord && this.#implementation.mode == keyboardMode.chord);
            this.#implementation.mode = mode;
            if (doRelease)
                for (let key of this.#implementation.keyList)
                    handleElement(key, keyMap.get(key), false);
            refreshChordColors(mode);
        }; //this.#implementation.setMode

        this.#implementation.clearChord = _ => {
            this.#implementation.chord.clear();
            this.#implementation.chordRoot = -1;
            for (let key of this.#implementation.keyList) {
                const keyData = keyMap.get(key);
                key.style.fill = keyData.originalColor;
                keyData.isChordRoot = false;
                keyData.chordMember = false;
            } //loop
        }; //this.#implementation.clearChord

    } //constructor

    set keyHandler(aHandler) { this.#implementation.keyHandler = aHandler; }

    clearChord() { this.#implementation.clearChord(); }
    
    get first() { return this.#implementation.getFirst(); }
    get last() { return this.#implementation.getLast(); }
    
    hide() { this.#implementation.setVisibility(false); }
    show() { this.#implementation.setVisibility(true); }

    set mode(value) { this.#implementation.setMode(value); }
    get mode() { return this.#implementation.mode; }

} //class Keyboard
