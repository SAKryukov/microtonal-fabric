// Microtonal Fabric
//
// Copyright (c) Sergey A Kryukov, 2017-2021
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-fabric

"use strict";

const keyboardMode = { normal: 0, chord: 1, chordSet: 2, chordRootSet: 4 };
const keyHightlight = { normal: 0, down: 1, chord: 2, chordRoot: 4 };

class IKeyboardGeometry extends IInterface {
    createKeys(parentElement) {}
    highlightKey(keyElement, keyboardMode) {}
    isTouchKey(parentElement, keyElement) {} // for touch interface
    get defaultChord() {} // should return array of indices of keys in default chord
    customKeyHandler(keyElement, keyData, on) {} // return false to stop embedded handling
} //IKeyboardGeometry

class AbstractKeyboard {

    #implementation = { mode: 0, chord: new Set(), playingElements: new(Set), chordRoot: -1, useHighlight: true };

    constructor(parentElement) {

        IKeyboardGeometry.throwIfNotImplemented(this, IInterfaceStrictness.sameNumberOfFunctionArguments);

        this.#implementation.setVisibility = on => {
            parentElement.style.display = on ? "block" : "none";
        }; //this.#implementation.setVisibility
        const keyMap = new Map();

        const refreshChordColors = mode => {
            for (let keyIndex of this.#implementation.chord) {
                const chordKey = this.#implementation.keyList[keyIndex];
                const chordKeyData = keyMap.get(chordKey);
                this.highlightKey(chordKey, 
                    mode & keyboardMode.chordSet
                        ? (chordKeyData.isChordRoot ? keyHightlight.chordRoot : keyHightlight.chord)
                        : keyHightlight.normal);
            } //loop
        }; //refreshChordColors

        const handleElement = (element, elementData, on) => {
            if (this.customKeyHandler(element, elementData, on) === false) return;
            if (!elementData) return; // important when called from handleIndex, called via by recorder.play
            if (this.#implementation.recorder)
                (this.#implementation.recorder.record(on, elementData.index));
            if (this.#implementation.keyHandler)
                this.#implementation.keyHandler(elementData.index, on);
            if (this.#implementation.useHighlight)
                this.highlightKey(element, on ? keyHightlight.down : keyHightlight.normal);
            handlePlayingElementSet(element, on);
        }; //handleElement

        const handleIndex = (index, on) => {
            const element = this.#implementation.keyList[index];
            handleElement(element, keyMap.get(element), on);
        }; //handleIndex

        const handlePlayingElementSet = (element, on) => {
            if (this.#implementation.mode & keyboardMode.chord > 0) return;
            if (this.#implementation.mode & keyboardMode.chordRootSet > 0) return;
            if (on)
                this.#implementation.playingElements.add(element);
            else
                this.#implementation.playingElements.delete(element);
        }; //handlePlayingElementSet

        const handler = (element, on) => {
            const elementData = keyMap.get(element);
            if (this.#implementation.mode == keyboardMode.chord) {
                if (this.#implementation.chordRoot < 0 || this.#implementation.chord.size <= 0) {
                    handleElement(element, elementData, on);
                    return handlePlayingElementSet(element, on);
                } //if
                const delta = elementData.index - this.#implementation.chordRoot;
                for (let chordIndex of this.#implementation.chord) {
                    const shiftedChordIndex = chordIndex + delta;
                    if (shiftedChordIndex < 0 || shiftedChordIndex >= this.#implementation.keyList.length) continue;
                    const chordElement = this.#implementation.keyList[shiftedChordIndex];
                    handleElement(chordElement, keyMap.get(chordElement), on);
                    handlePlayingElementSet(chordElement, on);
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
                this.highlightKey(element, elementData.chordMember
                    ? (elementData.isChordRoot ? keyHightlight.chordRoot : keyHightlight.chord)
                    : keyHightlight.normal);
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
            } else if (this.#implementation.mode == keyboardMode.normal) {
                handleElement(element, elementData, on);
            } //if
        }; //handler

        this.#implementation.assignHandlers = () => {
            setMultiTouch(
                parentElement,
                keyElement => this.isTouchKey(parentElement, keyElement),
                (keyElement, _, on) => { handler(keyElement, on); });
            for (let key of this.#implementation.keyList) {
                key.onmousedown = event => handler(event.target, true);
                key.onmouseup = event => handler(event.target, false);
                key.onmouseenter = event => { if (event.buttons == 1) handler(event.target, true); }
                key.onmouseleave = event => { if (event.buttons == 1) handler(event.target, false); }
            } //loop
        } //this.#implementation.assignHandlers

        this.#implementation.stopAllSounds = () => {
            for (let element of this.#implementation.playingElements)
                handleElement(element, keyMap.get(element), false);
            this.#implementation.playingElements.clear();
        }; //this.#implementation.stopAllSounds

        this.#implementation.recreate = () => {
            this.#implementation.stopAllSounds();
            const keys = this.createKeys(parentElement);
            this.#implementation.keyList = keys;
            let index = 0;
            const useDefaultChord = this.defaultChord
                && this.defaultChord.constructor == Array
                && this.defaultChord.length > 0;
            for (let key of keys) {
                let inDefaultChord = false, isChordRoot = false;
                if (useDefaultChord) {
                    inDefaultChord = this.defaultChord.includes(index);
                    isChordRoot = index == this.defaultChord[0];
                    if (isChordRoot) this.#implementation.chordRoot = index;
                    if (inDefaultChord) this.#implementation.chord.add(index);        
                } //if
                keyMap.set(key, { index: index++, chordMember: inDefaultChord, isChordRoot: isChordRoot });
            } //loop
            this.#implementation.assignHandlers();
        }; //this.#implementation.recreate
        this.#implementation.recreate();

        this.#implementation.getFirst = () => 0;
        this.#implementation.getLast = () => keys.length - 1;

        this.#implementation.setMode = mode => {
            const doRelease = (mode != keyboardMode.chord && this.#implementation.mode == keyboardMode.chord);
            this.#implementation.mode = mode;
            if (doRelease)
                this.#implementation.stopAllSounds(true);
            refreshChordColors(mode);
        }; //this.#implementation.setMode

        this.#implementation.clearChord = () => {
            this.#implementation.chord.clear();
            this.#implementation.chordRoot = -1;
            for (let key of this.#implementation.keyList) {
                const keyData = keyMap.get(key);
                key.style.fill = keyData.originalColor;
                keyData.isChordRoot = false;
                keyData.chordMember = false;
            } //loop
        }; //this.#implementation.clearChord

        this.#implementation.playSequence = () => {
            if (!this.#implementation.recorder) return;
            const cancelling = this.#implementation.recorder.playing;
            this.#implementation.recorder.play(handleIndex);
            if (cancelling)
                this.#implementation.stopAllSounds();
        }; //this.#implementation.playSequence

    } //constructor

    recreate() { this.#implementation.recreate(); }

    set keyHandler(aHandler) { this.#implementation.keyHandler = aHandler; }

    clearChord() { this.#implementation.clearChord(); }
    
    get first() { return this.#implementation.getFirst(); }
    get last() { return this.#implementation.getLast(); }
    
    hide() { this.#implementation.setVisibility(false); }
    show() { this.#implementation.setVisibility(true); this.#implementation.assignHandlers(); }

    set mode(value) { this.#implementation.setMode(value); }
    get mode() { return this.#implementation.mode; }

    playSequence(sequence) { this.#implementation.playSequence(sequence); }
    stopAllSounds() { this.#implementation.stopAllSounds(); } // used to cancel PlaySequence

    get useHighlight() { return this.#implementation.useHighlight; }
    set useHighlight(value) { this.#implementation.useHighlight = value; }

    get recorder() { return this.#implementation.recorder; }
    set recorder(value) { this.#implementation.recorder = value; }

} //class AbstractKeyboard
