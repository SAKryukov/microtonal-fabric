// Microtonal Music Study with Chromatic Lattice Keyboard
//
// Copyright (c) Sergey A Kryukov, 2017
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

    let numberOfRows = 0;
    for (let node of nodes)
        if (node.constructor == SVGGElement)
            numberOfRows++;
    for (let node of nodes) {
        const rowCells = [];
        rowCells.rowNumber = rows.length;
        if (node.constructor != SVGGElement) continue;
        for (let rowCell of node.childNodes) {
            if (rowCell.constructor != SVGRectElement) continue;
            const key = {};
            key.activated = false;
            key.currentColor = definitionSet.highlightDefault;
            key.colorStack = [];
            key.textStack = [];
            key.rectangle = rowCell;
            key.rectangle.key = key;
            key.numberInRow = rowCells.length;
            key.row = numberOfRows - rows.length - 1;
            rowCells.push(key);
            key.activate = function (key, chordMode, doActivate, chordNote, text, highlightChords) {
                if (key.activated && doActivate) return;
                if (!key.activated && !doActivate) return;
                key.activated = doActivate;
                if (soundAction)
                    soundAction(key, 0, key.tone, doActivate);
                const effectiveColor = chordNote ? definitionSet.highlightChordNote : definitionSet.highlightSound;
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
            key.rectangle.onmouseenter = function (event) {
                if (event.buttons == 1)
                    event.target.key.activate(event.target.key, event.ctrlKey, true);
                return false;
            };
            key.rectangle.onmouseleave = function (event) {
                event.target.key.activate(event.target.key, event.ctrlKey, false);
                return false;
            };
            key.rectangle.onmousedown = function (event) {
                if (event.button == 0)
                    event.target.key.activate(event.target.key, event.ctrlKey, true);
                else
                    event.target.key.activate(event.target.key, event.ctrlKey, false);
                return false;
            };
            key.rectangle.onmouseup = function (event) {
                if (event.button == 0)
                    event.target.key.activate(event.target.key, event.ctrlKey, false);
                return false;
            };
            //*/
        } //loop cells
        rows.splice(0, 0, rowCells);
    } //loop rows
    const svgNS = keyboard.getAttribute("xmlns");
    const notesGroup = document.createElementNS(svgNS, "g");
    keyboard.appendChild(notesGroup);

    setMultiTouch(
        (element) => { return element.dataset.multiTouchTarget; }, //elementSelector
        (element, touch, on) => { element.key.activate(element.key, false, on); } //elementHandler
    );

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
                const width = Math.round(cell.rectangle.width.baseVal.value / 3);
                label.style = "pointer-events:none";
                label.style.fontFamily = definitionSet.labelFontFamily;
                label.style.fontSize = width+"px";
                label.setAttributeNS(null, "x", cell.rectangle.x.baseVal.value + 2);
                label.setAttributeNS(null, "y", cell.rectangle.y.baseVal.value + width + 1);
                notesGroup.appendChild(label);
                cell.label = label;
                cell.textStack = [labelText];
            } //loop
    }; //rows.labelKeys

    return { rows: rows, soundActionSetter: setSoundActions, chordSetter: assignChord };

})();
