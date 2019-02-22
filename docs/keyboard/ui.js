// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017, 2019
//
// http://www.SAKryukov.org
// http://www.codeproject.com/Members/SAKryukov
// https://github.com/SAKryukov
// https://github.com/SAKryukov/microtonal-chromatic-lattice-keyboard
//
// Original publication:
// https://www.codeproject.com/Articles/1204180/Microtonal-Music-Study-Chromatic-Lattice-Keyboard"use strict";

const keyboardHandler = (function () {

    let soundAction = null; // soundAction: function(object, octave, tone, doStart)
    let chordSoundAction = null; // chordSoundAction: function(chord, doStart), where chord is and array of: {object, octave: element.octave, tone: element.tone}
    const setSoundActions = function (soundActionInstance, chordSoundActionInstance) {
        soundAction = soundActionInstance;
        chordSoundAction = chordSoundActionInstance;
    }; //setSoundActions

    const rows = [];
    let chord;
    const assignChord = function (chordInstance) {
        chord = chordInstance;
    }; //assignChord

    const nodes = elements.keyboard.childNodes;

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

    for (let rowIndex = 0; rowIndex < keyboardStructure.rows.length; ++rowIndex) {
        const currentRow = keyboardStructure.rows[rowIndex];
        const currentKeyRow = [];
        rows.unshift(currentKeyRow); 
        for (let keyIndex = 0; keyIndex < currentRow.length; ++keyIndex) {
            const key = {};
            currentKeyRow.push(key);
            key.activated = false;
            key.currentColor = definitionSet.highlightDefault;
            key.colorStack = [];
            key.textStack = [];
            key.rectangle = currentRow[keyIndex];
            key.rectangle.key = key;
            key.numberInRow = keyIndex;
            key.row = rowIndex;
            key.activate = function (key, chordMode, doActivate, volumeDynamics, chordNote, text, highlightChords) {
                if (key.activated && doActivate) return;
                if (!key.activated && !doActivate) return;
                if (volumeDynamics == undefined)
                    volumeDynamics = 1.0; 
                key.activated = doActivate;
                if (soundAction)
                    soundAction(key, 0, key.tone, doActivate, volumeDynamics);
                const effectiveColor = chordNote ? definitionSet.highlightChordNote : definitionSet.highlightSound;
                if (!chordNote) highlightChords = true;
                visualActivate(key, effectiveColor, text, highlightChords, doActivate);
                if (!chordMode && doActivate) return;
                if (chord && !chordNote) {
                    const chordLayout = chordLayoutFinder(key, chord);
                    const highlightChords = chordLayout.highlightChords;
                    for (let chordElement of chordLayout)
                        chordElement.key.activate(chordElement.key, chordMode, doActivate, volumeDynamics, true, chordElement.title, highlightChords);
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
        } //loop key
    } //loop row

    const svgNS = keyboard.getAttribute("xmlns");
    const notesGroup = document.createElementNS(svgNS, "g");
    keyboard.appendChild(notesGroup);

    (function setupTouch() {
        let touchDynamicsEnabled = elements.controls.touch.checkboxUseTouchDynamics.checked;
        elements.controls.touch.checkboxUseTouchDynamics.onclick = (ev) => { touchDynamicsEnabled = ev.target.checked; }
        let volumeDivider = definitionSet.initialTouchDynamicsDivider;
        const calibrationDoneHandler = (value) => {
            volumeDivider = value;
        }; 
        setupMultiTouchCalibration(
            elements.controls.touch.calibrationProbe,
            elements.controls.touch.calibrationResult,
            elements.controls.touch.buttonDone,
            calibrationDoneHandler);
        const dynamicAlgorithm = setMultiTouch().dynamicAlgorithm;
        setMultiTouch(
            elements.keyboard,
            (element) => { return element.dataset.multiTouchTarget; }, //elementSelector
            (element, touch, on) => {
                let volume = 1;
                if (touchDynamicsEnabled)
                    volume = dynamicAlgorithm(touch, volumeDivider);
                element.key.activate(element.key, false, on, volume);
            } //elementHandler
        );    
    })();

    rows.iterateKeys = function (handler) { // handler(key)
        for (let row of rows)
            for (let cell of row)
                handler(cell);
    }; //rows.iterateKeys

    rows.labelKeys = function (labelMaker) {
        while (notesGroup.firstChild)
            notesGroup.removeChild(notesGroup.firstChild);
        if (!labelMaker) return;
        for (let row of rows)
            for (let cell of row) {
                const label = document.createElementNS(svgNS, "text");
                const labelText = labelMaker(cell);
                label.innerHTML = labelText;
                const width = cell.rectangle.width.baseVal.value * definitionSet.label.fontSize;
                label.style = "pointer-events:none";
                label.style.fontFamily = definitionSet.labelFontFamily;
                label.style.fontSize = width+"px";
                label.setAttributeNS(null, "x", cell.rectangle.x.baseVal.value + width * definitionSet.label.paddingLeft);
                label.setAttributeNS(null, "y", cell.rectangle.y.baseVal.value + width + width * definitionSet.label.paddingTop);
                notesGroup.appendChild(label);
                cell.label = label;
                cell.textStack = [labelText];
            } //loop
    }; //rows.labelKeys

    return { rows: rows, soundActionSetter: setSoundActions, chordSetter: assignChord };

})();
