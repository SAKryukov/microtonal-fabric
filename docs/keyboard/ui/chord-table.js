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

function setupChordTable(table, toneCount, baseOctave, buildButton, resetButton, closeButton, beforeClosing) {
    resetButton.inputElements = [];
    const findInputElements = function(element) {
        for (let child of element.childNodes) {
            const constructor = child.constructor;
            if (constructor == HTMLInputElement && child.checked != undefined) {
                if (child.checked)
                    child.checkedByDefault = true;
                resetButton.inputElements.push(child); 
            } //loop element.childNodes
            findInputElements(child);
        } //loop
    }; //findInputElements
    findInputElements(table);
    closeButton.table = table;
    closeButton.onclick = function(event) {
        if (beforeClosing)
            beforeClosing();
    }; //closeButton.onclick
    buildButton.chordBuilder = new ChordBuilder(table);
    table.chordBuilder = buildButton.chordBuilder;
    buildButton.toneCount = toneCount;
    resetButton.onclick = function(event) {
        for (let inputControl of event.target.inputElements)
            inputControl.checked = inputControl.checkedByDefault;
    }; //resetButton.onclick
    buildButton.onclick = function(event) {
        const keyboard = event.target.keyboard;
        const toneCount = event.target.toneCount;
        if (keyboard)
            keyboard.clearChord();
        const chord = event.target.chordBuilder.build();
        if (keyboard)
            keyboard.setChordNode(baseOctave + 0, 0, true);
        for (let chordNote of chord) {
            const noteOctave = Math.floor(chordNote.note / toneCount);
            const note = chordNote.note % toneCount;
            if (keyboard)
                keyboard.setChordNode(baseOctave + chordNote.octave + noteOctave, note, true);
        } //loop
        if (beforeClosing)
            beforeClosing();
    }; //buildButton.onclick
    buildButton.table = table;
} //setupChordTable

