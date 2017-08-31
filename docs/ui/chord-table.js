"use strict";

function setupChordTable(table, toneCount, buildButton, resetButton, closeButton, beforeClosing) {
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
    buildButton.toneCount = toneCount;
    resetButton.onclick = function(event) {
        for (let inputControl of event.target.inputElements)
            inputControl.checked = inputControl.checkedByDefault;
    }; //resetButton.onclick
    buildButton.onclick = function(event) {
        const keyboard = event.target.keyboard;
        const toneCount = event.target.toneCount;
        keyboard.clearChord();
        const chord = event.target.chordBuilder.build();
        keyboard.setChordNode(baseOctave + 0, 0, true);
        for (let chordNote of chord) {
            const noteOctave = Math.floor(chordNote.note / toneCount);
            const note = chordNote.note % toneCount;
            keyboard.setChordNode(baseOctave + chordNote.octave + noteOctave, note, true);
        } //loop
        if (beforeClosing)
            beforeClosing();
    }; //buildButton.onclick
    buildButton.table = table;
} //setupChordTable

