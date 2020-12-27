// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2020
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard

"use strict";

const keyboardHandling = (definitionSet, keyboardStructure, chordLayoutFinder, soundAction) => {

    const rows = [];
    let chord;
    const assignChord = function (chordInstance) {
        chord = chordInstance;
    }; //assignChord

    const nodes = definitionSet.elements.keyboard.childNodes;

    const visualActivate = function (key, color, text, highlightChords, doActivate) {
        if (doActivate) {
            if (text) {
                key.textStack.push(key.label.innerHTML);
                key.label.innerHTML = text;
            } //if
            if (highlightChords) {
                key.colorStack.push(key.currentColor);
                key.currentColor = color;
                key.rectangle.style.fill = color;
            } //if
        } else {
            const oldText = key.textStack.pop();
            if (oldText)
                key.label.innerHTML = oldText;
            if (highlightChords) {
                const oldColor = key.colorStack.pop();
                if (oldColor) {
                    key.currentColor = oldColor;
                    key.rectangle.style.fill = oldColor;
                } //if
            } //if highlightChords
        } //if
    } //visualActivate

    keyboardStructure.iterateKeys(key => {
        key.activated = false;
        key.currentColor = definitionSet.options.highlightDefault;
        key.colorStack = [];
        key.textStack = [];
        key.activate = function (key, chordMode, doActivate, chordNote, text, highlightChords) {
            if (key.activated && doActivate) return;
            if (!key.activated && !doActivate) return;
            key.activated = doActivate;
            if (soundAction)
                soundAction(key, doActivate);
            const effectiveColor = chordNote ? definitionSet.options.highlightChordNote : definitionSet.options.highlightSound;
            if (!chordNote) highlightChords = true;
            visualActivate(key, effectiveColor, text, highlightChords, doActivate);
            if (!chordMode && doActivate) return;
            if (chord && !chordNote) {
                const chordLayout = chordLayoutFinder(key, chord);
                const highlightChords = chordLayout.highlightChords;
                for (let chordElement of chordLayout)
                    chordElement.key.activate(chordElement.key, chordMode, doActivate, true, chordElement.title, highlightChords);
            } //if
        }; //key.activate
        key.rectangle.dataset.multiTouchTarget = true;
        key.rectangle.onmouseenter = (event) => {
            if (event.buttons == 1)
                event.target.key.activate(event.target.key, event.ctrlKey, true);
            return false;
        };
        key.rectangle.onmouseleave = (event) => {
            event.target.key.activate(event.target.key, event.ctrlKey, false);
            return false;
        };
        key.rectangle.onmousedown = (event) => {
            if (event.button == 0)
                event.target.key.activate(event.target.key, event.ctrlKey, true);
            else
                event.target.key.activate(event.target.key, event.ctrlKey, false);
            return false;
        };
        key.rectangle.onmouseup = (event) => {
            if (event.button == 0)
                event.target.key.activate(event.target.key, event.ctrlKey, false);
            return false;
        };
    }); //keyboardStructure.iterateKeys

    const setupTouch = () => {
        const calibrationDoneHandler = (value) => {
            volumeDivider = value;
        }; 
        setMultiTouch(
            definitionSet.elements.keyboard,
            (element) => { return element.dataset.multiTouchTarget; }, //elementSelector
            (element, touch, on) => {
                let volume = 1;
                element.key.activate(element.key, false, on, volume);
            } //elementHandler
        );    
    }; //setupTouch

    return { chordSetter: assignChord, setupTouch: setupTouch };

}; //keyboardHandling
