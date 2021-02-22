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

class Keyboard {

    #implementation = { mode: 0, chord: new Set(), playingElements: new(Set), chordRoot: -1, useHighlight: true };

    constructor(element, layout, options, recorder) { //options: definitionSet.keyboardOptions

        this.#implementation.recorder = recorder;

        this.#implementation.setVisibility = on => {
            element.style.display = on ? "block" : "none";
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
            if (!elementData) return; // important when called from handleIndex, called via by recorder.play
            if (this.#implementation.recorder)
                (this.#implementation.recorder.record(on, elementData.index));
            if (this.#implementation.keyHandler)
                this.#implementation.keyHandler(elementData.index, on);
            if (this.#implementation.useHighlight)
                element.style.fill = on ? options.highlightColor : elementData.originalColor;
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
                if (on && this.#implementation.recorder)
                    this.#implementation.recorder.recordMark(sharedDefinitionSet.automaticChordStartMarker);
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
            } else if (this.#implementation.mode == keyboardMode.normal) {
                handleElement(element, elementData, on);
            } //if
        }; //handler

        const keys = Array.prototype.slice.call(element.firstElementChild.children);

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
        const noteNames = soundDefinitionSet.noteNames.edo29;
        const locationA = noteNames.indexOf("A");
        for (let key of keys) {
            const inDefaultChord = layout.defaultChord.includes(index);
            const isChordRoot = index == layout.defaultChord[0];
            if (isChordRoot) this.#implementation.chordRoot = index;
            if (inDefaultChord) this.#implementation.chord.add(index);
            const note = noteNames[(index + layout.system - (layout.shiftA % layout.system) + locationA) % noteNames.length];
            const whiteNote = note.length == 1;
            const originalColor = index == layout.shiftA
                ?
                options.standardColorA
                :
                (whiteNote && layout.autoWhiteColor ? options.whiteKeyColor : key.style.fill);
            key.style.fill = originalColor;    
            keyMap.set(key, {
                index: index, originalColor: originalColor,
                chordMember: inDefaultChord, isChordRoot: isChordRoot });
            ++index;
        } //loop

        this.#implementation.assignHandlers = () => {
            setMultiTouch(
                element,
                element => element.constructor == SVGRectElement,
                (element, _, on) => { handler(element, on); });
            for (let key of keys) {
                key.onmousedown = event => handler(event.target, true);
                key.onmouseup = event => handler(event.target, false);
                key.onmouseenter = event => { if (event.buttons == 1) handler(event.target, true); }
                key.onmouseleave = event => { if (event.buttons == 1) handler(event.target, false); }
            } //loop
        } //this.#implementation.assignHandlers
        this.#implementation.assignHandlers();

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

        this.#implementation.stopAllSounds = () => {
            for (let element of this.#implementation.playingElements)
                handleElement(element, keyMap.get(element), false);
            this.#implementation.playingElements.clear();
        }; //this.#implementation.stopAllSounds

    } //constructor

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

} //class Keyboard
